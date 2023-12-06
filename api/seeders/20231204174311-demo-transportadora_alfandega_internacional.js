'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Transportadora_Alfandega_Internacional', [
      {
        transportadora_internacional_id: 1,
        alfandega_internacional_id: 1
      },
      {
        transportadora_internacional_id: 1,
        alfandega_internacional_id: 2
      },
      {
        transportadora_internacional_id: 2,
        alfandega_internacional_id: 2
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Transportadora_Alfandega_Internacional', null, {});
  }
};
