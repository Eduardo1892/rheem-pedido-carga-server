module.exports = (sequelize, type, PedidoCargaTracking) =>{

  return sequelize.define('pedidos_carga', {
      codigo:{
        type: type.STRING(128),
        primaryKey: true,
        allowNull: false, 
      },
      orden_venta: {
        type: type.STRING,
        allowNull: false,
      },
      orden_compra: {
        type: type.STRING,
        allowNull: false,
      },
      rut_cliente: {
        type: type.STRING,
        allowNull: true,
      },
      nombre_cliente: {
        type: type.STRING,
        allowNull: true,
      },
      patente: {
        type: type.STRING,
        allowNull: true,
      },
      fecha: {
        type: type.DATE,
        allowNull: false,
      },
      
  },{
      //agrega atributos timestamp (updatedAt, createdAt).
      timestamps: true,
      //evita que sequelize ponga el nombre de la tabla en plural.
      freezeTableName: true, 
      //agrega el nombre de la tabla.
      tableName: 'pedidos_carga'
  })

}