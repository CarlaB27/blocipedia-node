const Collaborator = require("./models").Collaborator;
const User = require("./models").User;

module.exports = {
    getAllCollaborators(callback) {
        return User.all({
            include: [{
                model: Collaborator,
                as: "collaborators"
            }]
        })
            .then((users) => {
                callback(null, users);
            })
            .catch((err) => {
                callback(err);
            });
    },

addCollaborator (req, collaboratorId, callback) {
    return Collaborator.findOne({
        where: {
            wikiId: req.params.wikiId,
            userId: req.body.collaboratorId
        }
    })
    .then((collaborator) => {
        if(!collaborator){
            Collaborator.create({
                wikiId: req.params.wikiId,
                userId: req.body.id
            })
            .then((collaborator) => {
                callback(null, collaborator);
            })
            .catch((err) => {
                callback(err);
            });
        } else {
            callback ("error", "This wiki already has a collaborator");
        }
    })
},

removeCollaborator(req, collaboratorId, callback) {
    return Collaborator.findOne({
        where : {
            wikiId: req.params.wikiId,
            userId: req.body.id
        }
    })
    .then((collaborator) => {
        if(collaborator) {
            Collaborator.destroy({
                where: {
                    id: collaborator.id
                }
            })
            .then((collaborator) => {
                callback(null, collaborator);
            })
            .catch((err) => {
                callback(err);
            });
        } else {
            callback("error", "This wiki already has a collaborator");
        }
    })
}

}