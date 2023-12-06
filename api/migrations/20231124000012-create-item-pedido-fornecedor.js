'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Item_Pedido_Fornecedor', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      produto_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'Produtos', key: 'id' }
      },
      pedido_ressuprimento_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'Pedido_Ressuprimento', key: 'id' }
      },
      quantidade_pedida: {
        type: Sequelize.INTEGER
      },
      preco_acordado: {
        type: Sequelize.DOUBLE
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
    await queryInterface.dropTable('Item_Pedido_Fornecedor');
  }
};