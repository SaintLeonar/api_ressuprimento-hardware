'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Nota_Fiscal', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      identificador: {
        type: Sequelize.STRING
      },
      data_emissao: {
        type: Sequelize.DATE
      },
      data_recebimento: {
        type: Sequelize.DATE
      },
      pedido_ressuprimento_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'Pedido_Ressuprimento', key: 'id' }
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
    await queryInterface.dropTable('Nota_Fiscal');
  }
};