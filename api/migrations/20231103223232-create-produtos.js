'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Produtos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      sku: {
        type: Sequelize.STRING
      },
      ean: {
        type: Sequelize.STRING
      },
      deposito_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'Depositos', key: 'id' }
      },
      nome: {
        type: Sequelize.STRING
      },
      descricao: {
        type: Sequelize.STRING
      },
      tipo_produto: {
        type: Sequelize.ENUM,
        values: ['Gabinete', 'Placa mãe', 'CPU', 'Memória', 'Armazenamento', 'Fonte de energia', 'GPU', 'Outros'],
        defaultValue: 'Outros'
      },
      peso: {
        type: Sequelize.DOUBLE
      },
      preco_venda: {
        type: Sequelize.DOUBLE
      },
      preco_compra: {
        type: Sequelize.DOUBLE
      },
      quantidade: {
        type: Sequelize.INTEGER
      },
      estoque_seguranca: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      giro: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      inativo: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      sazonal: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      reposicao: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      excluido: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Produtos');
  }
};