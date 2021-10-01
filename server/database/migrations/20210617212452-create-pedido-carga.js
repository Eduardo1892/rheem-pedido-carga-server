'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('pedidos_carga', {
      codigo: {
        type: Sequelize.STRING(128),
        primaryKey: true,
        allowNull: false, 
      },
      orden_venta: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      orden_compra: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      rut_cliente: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      nombre_cliente: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      patente: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      fecha: {
        type: Sequelize.DATE,
        allowNull: false,
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
    await queryInterface.dropTable('pedidos_carga');
  }
};