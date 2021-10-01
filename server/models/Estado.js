module.exports = (sequelize, type) =>{

  return sequelize.define('estado', {
      codigo:{
        type: type.STRING(128),
        primaryKey: true,
        allowNull: false 
      },
      descripcion:{
        type: type.STRING,
        allowNull: false
      }
  },{
      //agrega atributos timestamp (updatedAt, createdAt).
      timestamps: true,
      //evita que sequelize ponga el nombre de la tabla en plural.
      freezeTableName: true, 
      //agrega el nombre de la tabla.
      tableName: 'estados'
  })

}