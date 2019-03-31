const userQueries = require("../db/queries.users.js");
const passport = require("passport");
const wikiQueries = require("../db/queries.wikis");
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const publishableKey = process.env.PUBLISHABLE_KEY;
const secretKey = process.env.SECRET_KEY;

module.exports = {
    signUp(req, res, next) {
        res.render("users/sign_up");
    },

    create(req, res, next) {
        let newUser = {
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
            passwordConfirmation: req.body.passwordConfirmation
        };
        userQueries.createUser(newUser, (err, user) => {
            const msg = {
                to: user.email,
                from: 'support@blocipedia.com',
                subject: 'Welcome to Blocipedia',
                text: 'Thanks for joining Blocipedia!',
                html: '<strong>Thanks for joining Blocipedia!</strong>',
            };
            if (err) {
                req.flash("error", err);
                res.redirect("/users/sign_up");
            } else {
                passport.authenticate("local")(req, res, () => {
                    req.flash("notice", "You've successfully signed in!");
                    sgMail.send(msg);
                    res.redirect("/");
                })
            }
        });
    },

    signInForm(req, res, next) {
        res.render("users/sign_in");
    },

    signIn(req, res, next) {
        passport.authenticate("local")(req, res, function () {
            if (!req.user) {
                req.flash("notice", "Sign in failed. Please try again.")
                res.redirect("/users/sign_in");
            } else {
                req.flash("notice", "You've successfully signed in!");
                res.redirect("/");
            }
        })
    },

    signOut(req, res, next) {
        req.logout();
        req.flash("notice", "You've successfully signed out!");
        res.redirect("/");
    },

    payment(req, res, next) {
        res.render("users/payment");
    },

   show(req, res, next) {
       userQueries.getUser(req.params.id, (err, user) => {
           if (err || user === null) {
               req.flash("notice", "No user found");
               res.redirect("/");
           } else {
               res.render("users/show", {user});
           }
       });
   },

   showAll(req, res, next){
    userQueries.getAllUsers((err, users) => {
      if(err){
          res.redirect(500, "static/index");
      }
      else{
          console.log(users);
          res.render("wikis/edit", {users});
      }
    })
  },
    upgrade(req, res, next) {
        var stripe = require("stripe")("sk_test_Mkxf5IlDZL3ha47YqRkdOHEe00kxPfwTlO");
        // Token is created using Checkout or Elements!
        // Get the payment token ID submitted by the form:
        const token = req.body.stripeToken; // Using Express
        
          const charge = stripe.charges.create({
            amount: 1500,
            currency: 'usd',
            description: 'Premium Membership',
            source: token,
          });
          
        userQueries.updateUserRole(req.params.id, 1, (err, user) => {
            if(err || user == null) {
              req.flash("notice", "No user found.");
              res.redirect(404, `/users/${req.params.id}`);
            }
            else {
              req.flash("notice", "Welcome, premium member!");
              res.redirect(`/users/${req.params.id}`);
            }
          });
          res.render("users/payment_response");
    },

    downgrade(req, res, next) {
        userQueries.updateUserRole(req.params.id, 0, (err, user) => {
            if(err || user == null) {
              res.redirect(404, `/users/${req.params.id}`);
            }
            else {
              req.flash("notice", "Your account has been downgraded to standard");
              res.redirect(`/users/${req.params.id}`);
            }
          });
          wikiQueries.downgradePrivate(req);
    }

}