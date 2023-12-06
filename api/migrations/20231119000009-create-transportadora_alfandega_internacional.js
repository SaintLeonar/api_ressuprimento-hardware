'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Transportadora_Alfandega_Internacional', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      transportadora_internacional_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'Transportadora_Internacional', key: 'id' }
      },
      alfandega_internacional_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'Alfandega_Internacional', key: 'id' }
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Transportadora_Alfandega_Internacional');
  }
};