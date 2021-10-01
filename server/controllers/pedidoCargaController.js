const { PedidoCarga, PedidoCargaTracking, PedidoCargaProducto, sequelize } = require('../database/db');
const { Sequelize, QueryTypes } = require('sequelize')
const uuidv4 = require('uuid').v4;
//llama el resultado de la validación
const { validationResult } = require('express-validator');


exports.crearPedidoCarga = async(req, res) => {

    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }

    try{

        const {  ordenVenta, ordenCompra, rutCliente, nombreCliente ,fecha, productos } = req.body;
       
        let codigoPedidoCarga = uuidv4();
        let codigoPedidoCargaTracking = uuidv4();

        //Verifico que el pedido carga no existe
        let pedidoCarga = await PedidoCarga.findOne({
            where: {
                orden_venta: ordenVenta
            }
        });

        if (!pedidoCarga) {
             //Creo el nuevo pedido carga
            pedidoCarga = await PedidoCarga.create({
                codigo: codigoPedidoCarga,
                orden_venta: ordenVenta,
                orden_compra: ordenCompra,
                rut_cliente: rutCliente,
                nombre_cliente: nombreCliente,
                fecha
            })
        } else{
            codigoPedidoCarga = pedidoCarga.codigo
        }
       
        //Verifico si el pedido carga tracking con estado sin asignar ya existe para el pedido carga
        let pedidoCargaTracking = await PedidoCargaTracking.findOne({
            where: {
                codigo_pedido_carga: codigoPedidoCarga,
                codigo_estado: '1',
            }
        });
        if (!pedidoCargaTracking) {
            await PedidoCargaTracking.create({
                codigo: codigoPedidoCargaTracking,
                codigo_pedido_carga: codigoPedidoCarga,
                codigo_usuario: "system",
                codigo_estado: 1,
                secuencia: 1,
            })
        }

        for(producto of productos){
            //verifico si el producto ya existe en el pedido carga
            let pedidoCargaProducto = await PedidoCargaProducto.findOne({
                where: {
                   codigo_producto: producto.codigo_producto,
                   codigo_pedido_carga: codigoPedidoCarga
                }
            })

            if(!pedidoCargaProducto) {
                await PedidoCargaProducto.create({
                    codigo: uuidv4(),
                    codigo_pedido_carga: codigoPedidoCarga,
                    codigo_producto: producto.codigo_producto,
                    cantidad_requerida: producto.cantidad_requerida,
                    cantidad_ingresada: producto.cantidad_ingresada
                })
            }
        }

        res.json({
            msg: "Pedido de carga registrado"
        })
        

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }
}

exports.listarPedidosCarga = async(req, res) => {

    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }

    try {

        const { usuario } = req.query;

        const pedidoCarga = await PedidoCarga.findAll({
            include:[{
                model: PedidoCargaTracking
            }],
            where: {
                codigo_usuario: usuario
            }
        });

        res.json({
            pedidoCarga
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        });
    }
}

exports.listarPedidosCargaEstadoUsuario = async (req, res) => {

    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }

    try{

        const { codigoEstado, codigoUsuario } = req.query;
   
        if(codigoUsuario.trim() !== ""){
            query = `SELECT pct.codigo_pedido_carga, pc.rut_cliente, pc.nombre_cliente, 
                pc.fecha, pct.secuencia, pct.codigo_estado, pct.codigo_usuario, 
                pc.orden_venta, pc.orden_compra, pc.rut_cliente, pc.patente
            FROM pedidos_carga pc
            LEFT JOIN pedidos_carga_tracking pct
            ON pc.codigo = pct.codigo_pedido_carga  AND pct.secuencia = (SELECT MAX(secuencia) FROM pedidos_carga_tracking WHERE codigo_pedido_carga = pct.codigo_pedido_carga)
            WHERE pct.codigo_estado = '${codigoEstado}' AND (pct.codigo_usuario = '${codigoUsuario}' OR pct.codigo_usuario = 'system')`
        }

        const pedidoCarga = await sequelize.query(query,{ type: QueryTypes.SELECT });

        res.json({
            pedidoCarga
        })

    }catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        });
    }


}

exports.datosPedidosCarga = async (req, res) => {

    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }

    try{

        const { codigoPedidoCarga } = req.query;
   
        query = `SELECT pct.codigo_pedido_carga, pct.secuencia, pct.codigo_estado, pct.codigo_usuario, pc.orden_venta, pc.orden_compra, pc.rut_cliente, pc.patente
            FROM pedidos_carga pc
            LEFT JOIN pedidos_carga_tracking pct
            ON pc.codigo = pct.codigo_pedido_carga  AND pct.secuencia = (SELECT MAX(secuencia) FROM pedidos_carga_tracking WHERE codigo_pedido_carga = pct.codigo_pedido_carga)
            WHERE pc.codigo = '${codigoPedidoCarga}'`
    
        const pedidoCarga = await sequelize.query(query,{ type: QueryTypes.SELECT });

        const totales = await sequelize.query(`
            SELECT 
                (SELECT SUM(cantidad_requerida) FROM pedidos_carga_productos WHERE codigo_pedido_carga = '${codigoPedidoCarga}') AS total_requerido_pedido,
                (SELECT SUM(cantidad_ingresada) FROM pedidos_carga_productos WHERE codigo_pedido_carga = '${codigoPedidoCarga}') AS total_ingresado_pedido`,
        {type: QueryTypes.SELECT})

        const total_requerido_pedido = totales[0].total_requerido_pedido
        const total_ingresado_pedido = totales[0].total_ingresado_pedido
         
        let pedidoFinalizado = false
        
        if(total_requerido_pedido === total_ingresado_pedido){
            pedidoFinalizado = true
        }


        res.json({
            pedidoCarga: pedidoCarga[0],
            pedidoFinalizado
        })

    }catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        });
    }


}

exports.actualizarPatente = async (req, res) => {


    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }

    try {

        let { codigo, patente } = req.body;

        //verifica que el pedido a actualizar existe.
        let pedidoCarga = await PedidoCarga.findByPk(codigo);
        if (!pedidoCarga) {
            return res.status(404).send({
                msg: `El pedido carga ${codigo} no existe`
            })
        }

        //actualiza los datos.
        pedidoCarga = await PedidoCarga.update({
            patente,
        }, {
            where: {
                codigo
            }
        })

        res.json(pedidoCarga);

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }
 

}