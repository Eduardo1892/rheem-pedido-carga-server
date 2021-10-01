module.exports = (sequelize, type, PedidoCarga, Usuario, Estado) =>{

  return sequelize.define('pedido_carga_producto_series', {
      codigo:{
        type: type.STRING(128),
        primaryKey: true,
        allowNull: false 
      },
      codigo_pedido_carga: {
        type: type.STRING(128),
        allowNull: false,
        references:{
          model: PedidoCarga,
          key: 'codigo'
        }
      },
      codigo_producto: { 
        type: type.STRING,
        allowNull: false,
      },
      secuencia: {
        type: type.INTEGER,
        allowNull: true,
      },
      numero_serie: {
        type: type.STRING,
        allowNull: true,
      },
      etiqueta_pallet: {
        type: type.STRING,
        allowNull: true,
      },
      etiqueta_cliente: {
        type: type.STRING,
        allowNull: true,
      },
      cantidad: {
        type: type.INTEGER,
        allowNull: true,
      },
  },{
      //agrega atributos timestamp (updatedAt, createdAt).
      timestamps: true,
      //evita que sequelize ponga el nombre de la tabla en plural.
      freezeTableName: true, 
      //agrega el nombre de la tabla.
      tableName: 'pedidos_carga_producto_series'
  })

}