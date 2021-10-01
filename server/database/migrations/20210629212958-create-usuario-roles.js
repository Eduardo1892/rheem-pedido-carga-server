'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('usuario_roles', {
      codigo: {
        type: Sequelize.STRING(128),
        primaryKey: true,
        allowNull: false 
      },
      codigo_usuario: {
        type: Sequelize.STRING(128),
        allowNull: false,
        references:{
          model: 'usuarios',
          key: 'codigo'
        }
      },
      codigo_rol: {
        type: Sequelize.STRING(128),
        allowNull: false,
        references:{
          model: 'roles',
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
    await queryInterface.dropTable('usuario_roles');
  }
};