'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    let usuarios = [{
      codigo: 'system',
      clave: '$2a$10$9wpsEopYMcnCbEjQSGYaMu4xcOZoLN5t5TAHV.4sja8ayFrUeEy.G',
      nombre: 'system',
      email: 'sys.tem@gmail.com',
      inactivo: false,
    }, {
      codigo: '18999799k',
      clave: '$2a$10$9wpsEopYMcnCbEjQSGYaMu4xcOZoLN5t5TAHV.4sja8ayFrUeEy.G',
      nombre: 'Eduardo Alvarez',
      email: 'ed.alvarezv@gmail.com',
      inactivo: false
    }]

    await queryInterface.bulkInsert('usuarios', usuarios, {});

    let estados = [{
      codigo: '1',
      descripcion: 'sin asignar'
    }, {
      codigo: '2',
      descripcion: 'en preparacion'
    }]

    await queryInterface.bulkInsert('estados', estados, {});

    let pedidosCarga = [{
      codigo: '1A',
      orden_venta: 'ov339348',
      orden_compra: '22168',
      rut_cliente: '78853220',
      nombre_cliente: 'Cliente A',
      patente: '',
      fecha: '2021-06-22 17:00:00',
    }, {
      codigo: '1B',
      orden_venta: 'ov310250',
      orden_compra: '6505445867',
      rut_cliente: '76568660',
      nombre_cliente: 'Cliente B',
      patente: '',
      fecha: '2021-06-22 17:30:00',
    }]

    await queryInterface.bulkInsert('pedidos_carga', pedidosCarga, {});

    let pedidosCargaProductos = [{
      codigo: '1A1',
      codigo_pedido_carga: '1A',
      codigo_producto: '610010024',
      descripcion_producto: 'Calefont A',
      cantidad_requerida: 120,
      cantidad_ingresada: 0,
    }, {
      codigo: '1B1',
      codigo_pedido_carga: '1B',
      codigo_producto: '600052721F',
      descripcion_producto: 'Calefont A',
      cantidad_requerida: 6,
      cantidad_ingresada: 0,
    }, {
      codigo: '2B2',
      codigo_pedido_carga: '1B',
      codigo_producto: '600074513D',
      descripcion_producto: 'Calefont B',
      cantidad_requerida: 15,
      cantidad_ingresada: 0,
    }]

    await queryInterface.bulkInsert('pedidos_carga_productos', pedidosCargaProductos, {})


    let pedidosCargaTracking = [{
      codigo: '1A1',
      codigo_pedido_carga: '1A',
      codigo_usuario: 'system',
      codigo_estado: '1',
      secuencia: 1,
      comentario: '',
    }, {
      codigo: '1B1',
      codigo_pedido_carga: '1B',
      codigo_usuario: 'system',
      codigo_estado: '1',
      secuencia: 1,
      comentario: '',
    }, {
      codigo: '1B2',
      codigo_pedido_carga: '1B',
      codigo_usuario: '18999799k',
      codigo_estado: '2',
      secuencia: 2,
      comentario: '',
    }]

    await queryInterface.bulkInsert('pedidos_carga_tracking', pedidosCargaTracking, {});

  },

  down: async (queryInterface, Sequelize) => {
    
    await queryInterface.bulkDelete('pedidos_carga_tracking', null, {});
    await queryInterface.bulkDelete('pedidos_carga_productos', null, {});
    await queryInterface.bulkDelete('pedidos_carga', null, {});
    await queryInterface.bulkDelete('estados', null, {});
    await queryInterface.bulkDelete('usuarios', null, {});


  }
};
