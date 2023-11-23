'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Pedido_Ressuprimentos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      frete_internacional: {
        type: Sequelize.DOUBLE
      },
      frete_local: {
        type: Sequelize.DOUBLE
      },
      data_pedido: {
        type: Sequelize.DATE
      },
      aceito: {
        type: Sequelize.BOOLEAN
      },
      data_aceitacao: {
        type: Sequelize.DATE
      },
      previsao_chegada: {
        type: Sequelize.DATE
      },
      data_despacho: {
        type: Sequelize.DATE
      },
      chegada_alfandega_int: {
        type: Sequelize.DATE
      },
      liberacao_alfandega_int: {
        type: Sequelize.DATE
      },
      chegada_alfandega_nac: {
        type: Sequelize.DATE
      },
      liberacao_alfandega_nac: {
        type: Sequelize.DATE
      },
      data_chegada: {
        type: Sequelize.DATE
      },
      origem_ressuprimento: {
        type: Sequelize.ENUM,
        values: ['Nacional', 'Internacional']
      },
      status_pedido_ressuprimento: {
        type: Sequelize.ENUM,
        values: ['Em preparação', 'Despachado para alfandega internacional', 'Chegada em alfandega internacional', 
          'Liberado pela alfandega internacional', 'Chegada em alfandega nacional', 'Liberado pela alfandega nacional',
          'Em rota de entrega', 'Pedido entregue', 'Não aceito']
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
    await queryInterface.dropTable('Pedido_Ressuprimentos');
  }
};