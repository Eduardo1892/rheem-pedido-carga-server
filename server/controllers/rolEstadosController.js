const { RolEstados, Estado } = require('../database/db');
const { Sequelize } = require('sequelize')
const uuidv4 = require('uuid').v4;
//llama el resultado de la validación
const { validationResult } = require('express-validator');



exports.listarRolEstados = async (req, res) => {


    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }

    try{

        const { codigoRol } = req.query


        let rolEstados = await RolEstados.findAll({
            include:[{
                model: Estado,
                attributes: ['codigo', 'descripcion'],
            }],
            where:{
                codigo_rol: codigoRol
            }
        })

        const roles = rolEstados

        res.json({
            rolEstados
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }


}

