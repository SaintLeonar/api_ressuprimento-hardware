'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Transportadora_Local', [
      {
        cnpj: '12.345.678/0001-90',
        nome: 'Expresso Rápido Logística Ltda.',
        alfandega_nacional_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        cnpj: '98.765.432/0001-21',
        nome: 'Veloz Transportes e Logística S.A.',
        alfandega_nacional_id: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Transportadora_Local', null, {});
  }
};
