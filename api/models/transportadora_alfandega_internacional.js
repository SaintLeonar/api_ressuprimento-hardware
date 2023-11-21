'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transportadora_Alfandega_Internacional extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Produtos.init({
    transportadora_internacional_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Transportadora_Internacional', // Nome da tabela de Transportadora Internacional
        key: 'id', // Nome da chave primária na tabela de Transportadora Internacional
      },
    },
    alfandega_internacional_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Alfandega_Internacional', // Nome da tabela de Alfandega Internacional
        key: 'id', // Nome da chave primária na tabela de Alfandega Internacional
      },
    }
  }, {
    sequelize,
    modelName: 'Transportadora_Alfandega_Internacional',
  });
  return Transportadora_Alfandega_Internacional;
};