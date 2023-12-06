'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Pais', [
      {
        nome: 'Estados Unidos da América',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nome: 'Japão',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nome: 'China',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nome: 'Canadá',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Pais', null, {});
  }
};
