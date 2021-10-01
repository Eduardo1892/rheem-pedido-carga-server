'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('pedidos_carga_tracking', {
      codigo: {
        type: Sequelize.STRING(128),
        primaryKey: true,
        allowNull: false,
      },
      codigo_pedido_carga: {
        type: Sequelize.STRING(128),
        allowNull: false,
        references: {
          model: 'pedidos_carga',
          key: 'codigo'
        }
      },
      codigo_usuario: {
        type: Sequelize.STRING(12),
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'codigo'
        }
      },
      codigo_estado: {
        type: Sequelize.STRING(128),
        allowNull: false,
        references: {
          model: 'estados',
          key: 'codigo'
        }
      },
      secuencia: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
      },
      comentario: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
        
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('pedidos_carga_tracking');
  }
};