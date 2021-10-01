module.exports = (sequelize, type, PedidoCarga) =>{

  return sequelize.define('pedido_carga_producto', {
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
        allowNull: true,
      },
      descripcion_producto: {
        type: type.STRING,
        allowNull: true, 
      },
      cantidad_requerida: {
        type: type.INTEGER,
        allowNull: true,
      },
      cantidad_ingresada: {
        type: type.INTEGER,
        allowNull: true,
      }
  },{
      //agrega atributos timestamp (updatedAt, createdAt).
      timestamps: true,
      //evita que sequelize ponga el nombre de la tabla en plural.
      freezeTableName: true, 
      //agrega el nombre de la tabla.
      tableName: 'pedidos_carga_productos'
  })

}