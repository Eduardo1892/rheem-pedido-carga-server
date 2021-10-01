const { Usuario } = require('../database/db');
const { Sequelize } = require('sequelize')
const bcrypt = require('bcryptjs')
//llama el resultado de la validación
const { validationResult } = require('express-validator');



exports.crearUsuario = async(req, res) => {

    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }


    try {

        const { codigo, clave, nombre, email, inactivo } = req.body;

        //verifica que el usuario no existe.
        let usuario = await Usuario.findByPk(codigo);
        if (usuario) {
            return res.status(400).json({
                msg: 'El usuario ya existe'
            });
        }

        //genero un hash para el password
        let salt = bcrypt.genSaltSync(10);
        let clave_hash = bcrypt.hashSync(clave, salt);

        //Guarda el nuevo usuario
        usuario = await Usuario.create({
            codigo,
            clave: clave_hash,
            nombre,
            email,
            inactivo
        });

        //envía la respuesta
        res.json(usuario);

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }


}

exports.listarUsuarios = async(req, res, next) => {

    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }

    try {

        setTimeout(async() => {

            const { filtro } = req.query;

            const usuarios = await Usuario.findAll({
                  where: {
                    nombre: {
                        [Op.like]: '%' + filtro + '%',
                    },
                    inactivo: false
                },
                order: [
                    ['nombre', 'ASC'],
                ]
                
            }); 
            
            res.model_name = "usuarios";
            res.model_data = usuarios;
            
            next();

        }, 500);


    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }
}

exports.actualizarUsuario = async(req, res) => {

    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }

    try {

        let { codigo, clave, nombre, email, inactivo } = req.body;

        //verifica que el usuario a actualizar existe.
        let usuario = await Usuario.findByPk(codigo);
        if (!usuario) {
            return res.status(404).send({
                msg: `El usuario ${codigo} no existe`
            })
        }

        //compara la clave recibida con la almacenada en la base de datos
        //si son distintas entonces el usuario la actualizó y aplica el salt a la nueva clave
        if (clave !== usuario.clave) {
            //genero un hash para el password
            let salt = bcrypt.genSaltSync(10);
            clave = bcrypt.hashSync(clave, salt);
        }

        //actualiza los datos.
        usuario = await Usuario.update({
            nombre,
            clave,
            email,
            inactivo
        }, {
            where: {
                codigo
            }
        })

        res.json(usuario);

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }


}

exports.eliminarUsuario = async(req, res) => {

    try {
        //obtengo el rut del request
        const { codigo } = req.params;
        //verifica que el usuario a eliminar existe.
        let usuario = await Usuario.findByPk(codigo);
        if (!usuario) {
            return res.status(404).send({
                msg: `El usuario ${codigo} no existe`
            })
        }


        //elimino el registro.
        usuario = await Usuario.destroy({
            where: {
                codigo
            }
        });

        //envío una respuesta informando que el registro fue eliminado
        res.json({
            msg: 'Usuario eliminado correctamente'
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }
}