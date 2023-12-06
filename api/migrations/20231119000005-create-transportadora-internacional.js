'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Transportadora_Internacional', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      documento: {
        type: Sequelize.STRING
      },
      nome: {
        type: Sequelize.STRING
      },
      pais_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'Pais', key: 'id' }
      },
      moeda: {
        type: Sequelize.ENUM,
        values: ['Dólar Americano', 'Euro', 'Iene Japonês', 'Libra Esterlina', 'Yuan Chinês', 'Dólar Canadense', 'Dólar Australiano', 'Real'],
        defaultValue: 'Real'
      },
      modal_transporte: {
        type: Sequelize.ENUM,
        values: ['Aéreo', 'Marítimo', 'Terrestre'],
        defaultValue: 'Aéreo'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Transportadora_Internacional');
  }
};