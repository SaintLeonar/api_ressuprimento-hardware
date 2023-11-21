'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Transportadora_Alfandega_Internacional', {
      transportadoraInternacionalId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Transportadora_Internacional',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      alfandegaInternacionalId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Alfandega_Internacional',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Transportadora_Alfandega_Internacional');
  }
};
