const collaboratorQueries = require("../db/queries.collaborators");

module.exports = {
    index(req, res, next) {
        collaboratorQueries.getAllCollaborators((err, users) => {
            if (err) {
                res.redirect(500, "static/index");
            } else {
                res.render("collaborators/index", { users });
            }
        })
    },

    create(req, res, next) {
        if (req.user) {
            collaboratorQueries.addCollaborator(req, req.body, (err, collaborator) => {
                if (err) {
                    req.flash("error", err);
                }
                req.flash("notice", `User added as collaborator`);
                res.redirect(req.headers.referer);
            });
        } else {
            req.flash("notice", "You must be a user");
            res.redirect(req.headers.referer);
        }
    },

    destroy(req, res, next) {
        if (req.user) {
            collaboratorQueries.removeCollaborator(req, req.body, (err, collaborator) => {
                if (err) {
                    req.flash("error", err);
                }
                req.flash("notice", `User removed as collaborator`);
                res.redirect(req.headers.referer);
            });
        } else {
            req.flash("notice", "You must be a user");
            res.redirect(req.headers.referer);
        }
    }


}