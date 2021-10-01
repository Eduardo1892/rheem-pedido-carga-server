module.exports = (sequelize, type, Usuario, Roles) =>{

  return sequelize.define('usuario_rol', {
    codigo: {
      type: type.STRING(128),
      primaryKey: true,
      allowNull: false 
    },
    codigo_usuario: {
      type: type.STRING(128),
      allowNull: false,
      references:{
        model: Usuario,
        key: 'codigo'
      }
    },
    codigo_rol: {
      type: type.STRING(128),
      allowNull: false,
      references:{
        model: Roles,
        key: 'codigo'
      }
    }
  },{
      //agrega atributos timestamp (updatedAt, createdAt).
      timestamps: true,
      //evita que sequelize ponga el nombre de la tabla en plural.
      freezeTableName: true, 
      //agrega el nombre de la tabla.
      tableName: 'usuario_roles'
  })

}