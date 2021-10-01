const { UsuarioRol, Rol } = require('../database/db');
const { Sequelize } = require('sequelize')
const uuidv4 = require('uuid').v4;
//llama el resultado de la validación
const { validationResult } = require('express-validator');


exports.crearUsuarioRol = async(req, res) => {

    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }


    try {

        const {  codigoUsuario, codigoRol } = req.body;

        //verifica que el usuario vs rol no existe.
        let usuarioRol = await UsuarioRol.findOne({
            where:{
                codigo_usuario: codigoUsuario,
                codigo_rol: codigoRol
            }
        });
        if (UsuarioRol) {
            return res.status(400).json({
                msg: 'El usuario vs rol ya existe'
            });
        }


        //Guarda el nuevo usuario vs rol
        usuarioRol = await UsuarioRol.create({
            codigo: uuidv4(),
            descripcion,
            codigo_estado: codigoEstado
        });

        //envía la respuesta
        res.json(usuarioRol);

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }


}

exports.listarUsuarioRol = async(req, res) => {

    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }
 
    try{

        const { codigoUsuario } = req.query

        let usuarioRoles = await UsuarioRol.findAll({
            attributes: ['codigo_rol'],
            include:[{
                model: Rol,
                attributes: ['codigo','descripcion'],
            }],
            where:{
                codigo_usuario: codigoUsuario
            }
        })

        res.json({
            usuarioRoles
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }


}


exports.eliminarUsuarioRol = async(req, res) => {

    try {
        //obtengo el codigo del request
        const { codigo } = req.params;
        //verifica que el usuario vs rol a eliminar existe.
        let usuarioRol = await UsuarioRol.findOne(codigo);
        if (!usuarioRol) {
            return res.status(404).send({
                msg: `El usuario vs rol ${codigo} no existe`
            })
        }


        //elimino el registro.
        usuarioRol = await UsuarioRol.destroy({
            where: {
                codigo
            }
        });

        //envío una respuesta informando que el registro fue eliminado
        res.json({
            msg: 'Usuario vs rol eliminado correctamente'
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }
}