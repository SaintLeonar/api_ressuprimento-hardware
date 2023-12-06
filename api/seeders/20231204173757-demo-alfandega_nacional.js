'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Alfandega_Nacional', [
      {
        nome: 'Desembaraço Aduaneiro Brasil Ltda.',
        endereco: 'Avenida da Aduana, 789, Bairro do Comércio, Cidade Portuária, Estado do Despacho',
        estado: 'São Paulo',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nome: 'Fronteira Aduaneira S.A.',
        endereco: 'Rua das Importações, 456, Distrito Aduaneiro, Cidade Alfandegária, Estado da Receita',
        estado: 'Rio de Janeiro',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Alfandega_Nacional', null, {});
  }
};
