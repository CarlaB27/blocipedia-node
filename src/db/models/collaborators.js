'use strict';
module.exports = (sequelize, DataTypes) => {
  var Collaborators = sequelize.define('Collaborators', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    wikiId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  }, {});
  Collaborators.associate = function (models) {

    Collaborators.belongsTo(models.Wiki, {
      foreignKey: "wikiId",
      onDelete: "CASCADE"
    });

    Collaborators.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE"
    });

  };
  return Collaborators;
};