'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Item_Nota_Fiscal', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nota_fiscal_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'Nota_Fiscal', key: 'id' }
      },
      item_pedido_fornecedor_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'Item_Pedido_Fornecedor', key: 'id' }
      },
      quantidade_nf: {
        type: Sequelize.INTEGER
      },
      preco_nf: {
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
    await queryInterface.dropTable('Item_Nota_Fiscal');
  }
};