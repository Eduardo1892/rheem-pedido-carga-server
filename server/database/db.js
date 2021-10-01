const { Sequelize } = require('sequelize')
const config = require('../config/database')


//importar los modelos
const UsuarioModel = require('../models/Usuario');
const PedidoCargaModel = require('../models/PedidoCarga');
const PedidoCargaProductoModel = require('../models/PedidoCargaProducto');
const EstadoModel = require('../models/Estado');
const PedidoCargaTrackingModel = require('../models/PedidoCargaTracking');
const RolModel = require('../models/Rol');
const UsuarioRolModel = require('../models/UsuarioRol');
const PedidoCargaProductoSeriesModel = require('../models/PedidoCargaProductoSeries');
const RolEstadosModel = require('../models/RolEstados')

//conexión a la bd
const sequelize = new Sequelize(config)


//crea los modelos
const Usuario = UsuarioModel(sequelize, Sequelize);
const PedidoCarga = PedidoCargaModel(sequelize, Sequelize);
const Estado = EstadoModel(sequelize, Sequelize);
const PedidoCargaTracking = PedidoCargaTrackingModel(sequelize, Sequelize, PedidoCarga, Usuario, Estado);
const PedidoCargaProducto = PedidoCargaProductoModel(sequelize, Sequelize, PedidoCarga);
const Rol = RolModel(sequelize, Sequelize, Estado);
const UsuarioRol = UsuarioRolModel(sequelize, Sequelize, Usuario, Rol);
const PedidoCargaProductoSeries = PedidoCargaProductoSeriesModel(sequelize, Sequelize, PedidoCarga);
const RolEstados = RolEstadosModel(sequelize, Sequelize, Rol, Estado)

//relaciones
UsuarioRol.belongsTo(Rol, { foreignKey: 'codigo_rol' })
RolEstados.belongsTo(Rol, { foreignKey: 'codigo_rol' })
RolEstados.belongsTo(Estado, { foreignKey: 'codigo_estado' })


module.exports = {
    sequelize,
    Usuario,
    PedidoCarga,
    PedidoCargaProducto,
    Estado,
    PedidoCargaTracking,
    Rol,
    UsuarioRol,
    PedidoCargaProductoSeries,
    RolEstados
}