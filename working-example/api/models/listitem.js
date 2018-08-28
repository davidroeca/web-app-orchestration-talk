'use strict';
module.exports = (sequelize, DataTypes) => {
  const ListItem = sequelize.define('ListItem', {
    value: DataTypes.STRING
  }, {});
  ListItem.associate = function(models) {
    // associations can be defined here
  };
  return ListItem;
};