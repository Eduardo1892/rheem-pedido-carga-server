'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('pedidos_carga_producto_series', {
      codigo: {
        type: Sequelize.STRING(128),
        primaryKey: true,
        allowNull: false 
      },
      codigo_pedido_carga: {
        type: Sequelize.STRING(128),
        allowNull: false,
        references:{
          model: 'pedidos_carga',
          key: 'codigo'
        }
      },
      codigo_producto: { 
        type: Sequelize.STRING,
        allowNull: false,
      },
      secuencia: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      numero_serie: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      etiqueta_pallet: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      etiqueta_cliente: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      cantidad: {
        type: Sequelize.INTEGER,
        allowNull: true,
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
    await queryInterface.dropTable('pedidos_carga_producto_series');
  }
};