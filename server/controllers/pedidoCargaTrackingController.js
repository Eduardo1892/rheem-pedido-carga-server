const { PedidoCargaTracking, PedidoCargaProducto } = require('../database/db');
const { Sequelize } = require('sequelize')
const uuidv4 = require('uuid').v4;
//llama el resultado de la validación
const { validationResult } = require('express-validator');

exports.crearPedidoCargaTracking = async (req, res) => {


    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }

    try{

        const { codigoPedidoCarga, codigoUsuario, codigoEstado,comentario } = req.body;


        const codigo = uuidv4();

        //Verifico que el pedido carga, usuario y estado existan
        let pedidoCargaTracking = await PedidoCargaTracking.findOne({
            where: {
                codigo_pedido_carga: codigoPedidoCarga ,
                codigo_usuario: codigoUsuario,
                codigo_estado: codigoEstado
            }
        })

        if(!pedidoCargaTracking) {

            let secuencia = await PedidoCargaTracking.count({
                where: {
                    codigo_pedido_carga: codigoPedidoCarga,
                }
            });
            secuencia = secuencia + 1;
        

            //ingreso el nuevo tracking para el pedido de carga
            pedidoCargaTracking = await PedidoCargaTracking.create({
                codigo,
                codigo_pedido_carga: codigoPedidoCarga,
                codigo_usuario: codigoUsuario,
                codigo_estado: codigoEstado,
                secuencia,
                comentario, 
            }) 
        }

        res.json({pedidoCargaTracking})

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }
    


}
