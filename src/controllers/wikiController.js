const wikiQueries = require("../db/queries.wikis.js");
const Authorizer = require("../policies/wiki");
const markdown = require("markdown").markdown;

module.exports = {
    index(req, res, next) {
        if (req.user) {
            console.log(err);
            let usersWikis = [];
                wikiQueries.getAllWikis((err, wikis) => {
                    if (err) {
                        res.redirect(500, "static/index");
                    } else {
                        wikis.forEach(wiki => {
                            if(wiki.private) {
                                if(wiki.collaborators.length !== 0) {
                                    wiki.collaborators.forEach(collaborator => {
                                        if(collaborator.userId == req.user.id && wiki.id == collaborator.wikiId || req.user.id == wiki.user.id) {
                                            usersWikis.push(wiki)
                                        }
                                    })
                                } else {
                                    if(req.user.role == 2 || req.user.id == wiki.user.id) {
                                        usersWikis.push(wiki)
                                    }
                                }
                            }
                        });
                        res.render("wikis/index", { usersWikis });
                    }
                })
            } else {
                let usersWikis = [];
                wikiQueries.getAllPublicWikis((err, wikis) => {
                    if (err) {
                        res.redirect(500, "static/index");
                    }
                    else {
                        usersWikis = wikis;
                        res.render("wikis/index", { usersWikis });
                    }
                })
            }
        },

    new(req, res, next) {
        const authorized = new Authorizer(req.user).new;
        if (authorized) {
            res.render("wikis/new");
        } else {
            req.flash("notice", "You are not authorized to do that.");
            res.redirect("/wikis");
        }
    },

    create(req, res, next) {
        const authorized = new Authorizer(req.user).create();
        if (authorized) {
            let newWiki = {
                title: req.body.title,
                body: req.body.body,
                private: false,
                userId: req.user.id
            };
            wikiQueries.addWiki(newWiki, (err, wiki) => {
                if (err) {
                    res.redirect(500, "/wikis/new");
                }
                else {
                    res.redirect(303, `/wikis/${wiki.id}`);
                }
            });
        } else {
            req.flash("notice", "You are not authorized to do that.");
            res.redirect("/wikis");
        }
    },

    show(req, res, next) {
        wikiQueries.getWiki(req.params.id, (err, wiki) => {
            if (err || wiki == null) {
                console.log(err);
                res.redirect(404, "/");
            } else {
                if(wiki.private){
                    for (let i = 0; i < wiki.collaborators.length; i++) {
                        if(req.user.role == 1 && wiki.userId == req.user.id || wiki.collaborators[i].userId == req.user.id || req.user.role == 2) {
                            res.render("wikis/show", { wiki });
                        } else { 
                            console.log(err);
                            res.redirect(404, "/wikis");
                    }                     
                    }
                }
            }
        });
    },

    destroy(req, res, next) {
        wikiQueries.deleteWiki(req.params.id, (err, wiki) => {
            if (err) {
                res.redirect(500, `/wikis/${wiki.id}`);
            } else {
                res.redirect(303, "/wikis");
            }
        });
    },

    edit(req, res, next) {
        wikiQueries.getWiki(req.params.id, (err, wiki) => {
            if (err || wiki == null) {
                res.redirect(404, "/");
            } else {
                const authorized = new Authorizer(req.user, wiki).edit();
                if (authorized) {
                    res.render("wikis/edit", { wiki });
                } else {
                    req.flash("notice", "You are not authorized to do that.");
                    res.redirect(`/wikis/${req.params.id}`);
                }
            }
        });
    },

    update(req, res, next) {
        wikiQueries.updateWikiStatus(req, req.body, (err, wiki) => {
            if (err || wiki == null) {
                res.redirect(404, `/wikis/${req.params.id}/edit`);
            } else {
                res.redirect(`/wikis/${wiki.id}`);
            }
        });
    },

    makePrivate(req, res, next) {
        if (req.user.role == 1 || req.user.role == 2) {
            wikiQueries.updateWikiStatus(req, true, (err, wiki) => {
                if (err || wiki == null) {
                    res.redirect(404, `/wikis/${wiki.id}`);
                } else {
                    const authorized = new Authorizer(req.user, wiki).edit();
                    if (authorized) {
                        req.flash("notice", "This wiki is PRIVATE and only viewable to you");
                        res.redirect(`/wikis/${wiki.id}`);
                    }
                }
            })
        } else {
            req.flash("notice", "You are not authorized to do that. Upgrage to a premium account to make private wikis");
            res.redirect(`/wikis/${req.params.id}`);
        }
    },

    makePublic(req, res, next) {
        if (req.user.role == 1 || req.user.role == 2) {
            wikiQueries.updateWikiStatus(req, false, (err, wiki) => {
                if (err || wiki == null) {
                    res.redirect(404, `/wikis/${wiki.id}`);
                } else {
                    const authorized = new Authorizer(req.user, wiki).edit();
                    if (authorized) {
                        req.flash("notice", "You have made this wiki PUBLIC and is viewable to anyone");
                        res.redirect(`/wikis/${wiki.id}`);
                    }
                }

            })
        } else {
            req.flash("notice", "You are not authorized to do that. Upgrage to a premium account to make private wikis");
            res.redirect(`/wikis/${req.params.id}`);
        }
    },
} 
