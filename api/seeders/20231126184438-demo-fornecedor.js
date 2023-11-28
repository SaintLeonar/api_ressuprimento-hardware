'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Fornecedores', [
      {
        registro_fornecedor: 'GTS-US-789012',
        nome: 'GlobalTech Solutions',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        registro_fornecedor: 'PCI-US-765432',
        nome: 'PrimeConnect Imports',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        registro_fornecedor: 'NT-US-234567',
        nome: 'NexusTech Trading',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Fornecedores', null, {});
  }
};
