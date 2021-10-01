'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('rol_estados', {
      codigo_rol: {
        type: Sequelize.STRING(128),
        primaryKey: true,
        allowNull: false,
        references:{
          model: 'roles',
          key: 'codigo'
        }
      },
      codigo_estado: {
        type: Sequelize.STRING(128),
        primaryKey: true,
        allowNull: false,
        references:{
          model: 'estados',
          key: 'codigo'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('rol_estados');
  }
};