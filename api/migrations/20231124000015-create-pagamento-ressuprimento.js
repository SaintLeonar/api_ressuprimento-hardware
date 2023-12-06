'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Pagamento_Ressuprimento', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      pedido_ressuprimento_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'Pedido_Ressuprimento', key: 'id' }
      },
      data_pagamento: {
        type: Sequelize.DATE
      },
      data_vencimento: {
        type: Sequelize.DATE
      },
      multa: {
        type: Sequelize.DOUBLE
      },
      tipo_pagamento_ressuprimento: {
        allowNull: false,
        type: Sequelize.ENUM,
        values: ['Boleto', 'Transferência Bancária', 'Cartão de Crédito']
      },
      status_pagamento: {
        allowNull: false,
        type: Sequelize.ENUM,
        values: ['Aguardando', 'Realizado'],
        defaultValue: 'Aguardando'
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
    await queryInterface.dropTable('Pagamento_Ressuprimento');
  }
};