'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pais extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Pais.hasMany(models.Transportadora_Internacional, {
        foreignKey: 'Pais_Id'
      })
    }
  }
  Pais.init({
    nome: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Pais',
    freezeTableName: true,
    tableName: 'Pais'
  });
  return Pais;
};