'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Transportadora_Alfandega_Nacional', {
      transportadora_internacional_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Transportadora_Internacional',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      alfandega_internacional_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Alfandega_Nacional',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Transportadora_Alfandega_Nacional');
  }
};
