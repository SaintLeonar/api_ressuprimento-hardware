'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Transportadora_Internacional', [
      {
        documento: '12.345.678/0001-90',
        nome: 'Global Cargo Express',
        pais_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        documento: '98765432-1',
        nome: 'Dragon Logistics Co., Ltd.',
        pais_id: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Transportadora_Internacional', null, {});
  }
};
