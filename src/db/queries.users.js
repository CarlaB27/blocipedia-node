const User = require("./models").User;
const bcrypt = require("bcryptjs");
// const sgMail = require('@sendgrid/mail');
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = {

  createUser(newUser, callback) {
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(newUser.password, salt);
    return User.create({
      email: newUser.email,
      password: hashedPassword,
      username: newUser.name
    })
      .then((user) => {
        // const msg = {
        //   to: newUser.email,
        //   from: 'test@example.com',
        //   subject: 'Confirming your Blocipedia Sign Up',
        //   text: 'This is a confirmation email of your sign up with Blocipedia.',
        //   html: '<strong>This is a confirmation email of your sign up with Blocipedia.</strong>',
        // };
        // sgMail.send(msg);
        callback(null, user);
      })
      .catch((err) => {
        callback(err);
      })
  }

}