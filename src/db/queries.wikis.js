const Wiki = require("./models").Wiki;
const User = require("./models").User;
const Authorizer = require("../policies/wiki");
const Collaborator = require("./models").Collaborator;

module.exports = {
    getAllWikis(callback) {
        return Wiki.all({
            include: [{
                model: Collaborator,
                as: "collaborators"
            }]
        })
            .then((wikis) => {
                callback(null, wikis);
            })
            .catch((err) => {
                callback(err);
            });
    },

    getAllPublicWikis(callback) {
        return Wiki.all({
            where: {
                private: false
            },
            include: [{
                model: Collaborator,
                as: "collaborators"
            }]
        })
            .then((wikis) => {
                callback(null, wikis);
            })
            .catch((err) => {
                callback(err);
            });
    },

    addWiki(newWiki, callback) {
        return Wiki.create({
            title: newWiki.title,
            body: newWiki.body,
            userId: newWiki.userId
        })
            .then((wiki) => {
                callback(null, wiki);
            })
            .catch((err) => {
                callback(err);
            })
    },

    getWiki(id, callback) {
        return Wiki.findById(id, {
            include: [{
                model: Collaborator,
                as: "collaborators"
            }]
        })
            .then((wiki) => {
                callback(null, wiki);
            })
            .catch((err) => {
                callback(err);
            });
    },

    deleteWiki(req, callback) {
        return Wiki.findById(req.params.id)
            .then((wiki) => {
                const authorized = new Authorizer(req.user, wiki).destroy();
                if (authorized) {
                    wiki.destroy()
                        .then((res) => {
                            callback(null, wiki);
                        })
                } else {
                    req.flash("notice", "You are not authorized to do that.");
                    callback(401);
                }
            })
            .catch((err) => {
                callback(err);
            })
    },

    updateWiki(req, updatedWiki, callback) {
        return Wiki.findById(req.params.id)
            .then((wiki) => {
                if (!wiki) {
                    return callback("Wiki not found");
                }
                const authorized = new Authorizer(req.user, wiki).update();
                if (authorized) {
                    wiki.update(updatedWiki, {
                        fields: Object.keys(updatedWiki)
                    })
                        .catch((err) => {
                            callback(err);
                        })
                } else {
                    req.flash("notice", "You are not authorized to do that.");
                    callback("Forbidden");
                }
            });
    },

    updateWikiStatus(req, updatedStatus, callback) {
        return Wiki.findById(req.params.id)
            .then((wiki) => {
                if (!wiki) {
                    return callback("Wiki not found");
                } return wiki.update({ private: updatedStatus }, { fields: ['private'] })
                    .then(() => {
                        callback(null, wiki);
                    })
                    .catch((err) => {
                        callback(err);
                    });
            })
    },

    downgradePrivate(req, callback) {
        return Wiki.all()
            .then((wikis) => {
                wikis.forEach((wiki) => {
                    if (wiki.userId == req.user.id && wiki.private == true) {
                        wiki.update({
                            private: false
                        })
                    }
                });
            })
            .catch((err) => {
                callback(err);
            });
    }

}

