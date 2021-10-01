'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('pedidos_carga_productos', {
      codigo: {
        primaryKey: true,
        type: Sequelize.STRING(128),
        allowNull: false,
      },
      codigo_pedido_carga: {
        type: Sequelize.STRING(128),
        allowNull: false,
        references: {
          model: 'pedidos_carga',
          key: 'codigo',
        }
      },
      codigo_producto: { 
        type: Sequelize.STRING,
        allowNull: true,
      },
      descripcion_producto: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      cantidad_requerida: {    
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      cantidad_ingresada: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable('pedidos_carga_productos');
  }
};