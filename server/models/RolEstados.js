module.exports = (sequelize, type, Roles, Estado) =>{

  return sequelize.define('rol_estado', {
    codigo_rol: {
      type: type.STRING(128),
      allowNull: false,
      primaryKey: true,
      references:{
        model: Roles,
        key: 'codigo'
      }
    },
    codigo_estado: {
      type: type.STRING(128),
      allowNull: false,
      primaryKey: true,
      references:{
        model: Estado,
        key: 'codigo'
      }
    }
  },{
      //agrega atributos timestamp (updatedAt, createdAt).
      timestamps: true,
      //evita que sequelize ponga el nombre de la tabla en plural.
      freezeTableName: true, 
      //agrega el nombre de la tabla.
      tableName: 'rol_estados'
  })

}