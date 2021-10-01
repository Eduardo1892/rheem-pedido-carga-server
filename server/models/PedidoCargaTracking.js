module.exports = (sequelize, type, PedidoCarga, Usuario, Estado) =>{

  return sequelize.define('pedido_carga_tracking', {
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
      codigo_usuario: {
        type: type.STRING(12),
        allowNull: false,
        references:{
          model: Usuario,
          key: 'codigo'
        }
      },
      codigo_estado: {
        type: type.STRING(128),
        allowNull: false,
        references:{
          model: Estado,
          key: 'codigo'
        }
      },
      secuencia: {
        type: type.INTEGER,
        defaultValue: 0,
        allowNull: false
      },
      comentario: {
        type: type.STRING,
        allowNull: true,
      }
  },{
      //agrega atributos timestamp (updatedAt, createdAt).
      timestamps: true,
      //evita que sequelize ponga el nombre de la tabla en plural.
      freezeTableName: true, 
      //agrega el nombre de la tabla.
      tableName: 'pedidos_carga_tracking'
  })

}