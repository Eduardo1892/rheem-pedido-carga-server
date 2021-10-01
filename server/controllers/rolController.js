const { Rol } = require('../database/db');
const { Sequelize } = require('sequelize')
const uuidv4 = require('uuid').v4;
//llama el resultado de la validación
const { validationResult } = require('express-validator');



exports.crearRol = async(req, res) => {

    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }


    try {

        const {  descripcion, codigoEstado } = req.body;

        //verifica que el rol no existe.
        let rol = await Rol.findByPk(codigo);
        if (rol) {
            return res.status(400).json({
                msg: 'El rol ya existe'
            });
        }


        //Guarda el nuevo rol
        rol = await Rol.create({
            codigo: uuidv4(),
            descripcion,
            codigo_estado: codigoEstado
        });

        //envía la respuesta
        res.json(rol);

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }


}

exports.listarRoles = async(req, res, next) => {

    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }


    try {

        setTimeout(async() => {

            const { filtro } = req.query;

            const roles = await Rol.findAll({
                  where: {
                    descripcion: {
                        [Op.like]: '%' + filtro + '%',
                    }
                },
                order: [
                    ['descripcion', 'ASC'],
                ]
                
            }); 
            
            res.json({roles})

        }, 500);


    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }
}

exports.actualizarRol = async(req, res) => {

    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }

    try {

        let { codigo, descripcion, codigoEstado } = req.body;

        //verifica que el rol a actualizar existe.
        let rol = await Rol.findByPk(codigo);
        if (!rol) {
            return res.status(404).send({
                msg: `El rol ${codigo} no existe`
            })
        }

        //actualiza los datos.
        rol = await Rol.update({
            descripcion,
            codigo_estado: codigoEstado,
        }, {
            where: {
                codigo
            }
        })

        res.json(rol);

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }


}

exports.eliminarRol = async(req, res) => {

    try {
        //obtengo el codigo del request
        const { codigo } = req.params;
        //verifica que el rol a eliminar existe.
        let rol = await Rol.findByPk(codigo);
        if (!rol) {
            return res.status(404).send({
                msg: `El rol ${codigo} no existe`
            })
        }


        //elimino el registro.
        rol = await Rol.destroy({
            where: {
                codigo
            }
        });

        //envío una respuesta informando que el registro fue eliminado
        res.json({
            msg: 'Rol eliminado correctamente'
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }
}