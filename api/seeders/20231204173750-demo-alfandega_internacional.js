'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Alfandega_Internacional', [
      {
        nome: 'Customs Clearing Hub USA',
        endereco: '123 International Way, Port City, State of Trade, USA',
        pais: 'Estados Unidos',
        cidade: 'Tradeport',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nome: 'China Gateway Customs',
        endereco: '456 Customs Boulevard, Logistics District, Beijing, China',
        pais: 'China',
        cidade: 'Beijing',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Alfandega_Internacional', null, {});
  }
};
