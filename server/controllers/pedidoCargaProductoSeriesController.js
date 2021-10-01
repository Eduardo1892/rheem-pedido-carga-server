const {  PedidoCargaProductoSeries, PedidoCarga, PedidoCargaProducto, sequelize } = require('../database/db');
const { Sequelize, QueryTypes } = require('sequelize')
const uuidv4 = require('uuid').v4;
//llama el resultado de la validación
const { validationResult } = require('express-validator');



exports.crearPedidoCargaProductoSeries = async (req, res) => {

    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }

    try{
        
         const { 
            codigoPedidoCarga, 
            codigoProducto, 
            numeroSerie, 
            etiquetaPallet, 
            cantidad,
            porSerie, } = req.body;

        let codigo = uuidv4();

        if(porSerie){
            const serieExiste = await PedidoCargaProductoSeries.findOne({
                where:{
                    codigo_pedido_carga: codigoPedidoCarga,
                    numero_serie: numeroSerie,
                }
            })
            if (serieExiste) {
                return res.status(400).json({
                    msg: `La serie ${numeroSerie} ya existe`
                });
            }
        }

        //cuento la cantidad de productos ingresados
        let cantidadIngresadaActual = await PedidoCargaProductoSeries.sum('cantidad',{
            where: {
                codigo_pedido_carga: codigoPedidoCarga,
                codigo_producto: codigoProducto,
            }
        })

        if(isNaN(cantidadIngresadaActual)){
            cantidadIngresadaActual = 0
        }

        //obtengo el registro para verificar la cantidad ingresada
        const pedidoCargaCantidad = await PedidoCargaProducto.findOne({
            where:{
                codigo_pedido_carga: codigoPedidoCarga,
                codigo_producto: codigoProducto,
            }
        })

        //extraigo las cantidades reuqerida e ingresada
        const cantidadRequerida = pedidoCargaCantidad.cantidad_requerida

        //sumo la cantidad ingresada anteriormente a la que se ingresará 
        const cantidadIngresadaFinal = Number(cantidadIngresadaActual)+Number(cantidad)

        let cantidadPendiente = 0
        //si la cantidad ingresada es menor a la cantidad requerida, actualizo la cantidad ingresada
        //en la tabla pedido carga producto
        if(cantidadRequerida < cantidadIngresadaFinal ){

            cantidadPendiente = cantidadRequerida - cantidadIngresadaActual

            return res.status(400).json({
                msg: `Está ingresando ${cantidad} y sólo faltan ${cantidadPendiente}, verifique`
            });

        } else{
            await PedidoCargaProducto.update({
                cantidad_ingresada: cantidadIngresadaFinal,
            }, {
                where: {
                    codigo_pedido_carga: codigoPedidoCarga,
                    codigo_producto: codigoProducto
                }
            })
        }

        cantidadPendiente = cantidadRequerida - cantidadIngresadaFinal

        let secuencia = await PedidoCargaProductoSeries.count({
            where: {
                codigo_pedido_carga: codigoPedidoCarga,
            }
        });

        secuencia = secuencia + 1;

        //creo el registro nuevo
        await PedidoCargaProductoSeries.create({
            codigo,
            codigo_pedido_carga: codigoPedidoCarga,
            codigo_producto: codigoProducto,
            secuencia,
            numero_serie: numeroSerie,
            etiqueta_pallet: etiquetaPallet,
            etiqueta_cliente: "",
            cantidad
        })

        const totales = await sequelize.query(`
            SELECT 
                (SELECT SUM(cantidad_requerida) FROM pedidos_carga_productos WHERE codigo_pedido_carga = '${codigoPedidoCarga}') AS total_requerido_pedido,
                (SELECT SUM(cantidad_ingresada) FROM pedidos_carga_productos WHERE codigo_pedido_carga = '${codigoPedidoCarga}') AS total_ingresado_pedido,
                (SELECT SUM(cantidad_requerida) FROM pedidos_carga_productos WHERE codigo_pedido_carga = '${codigoPedidoCarga}' AND codigo_producto = '${codigoProducto}') AS total_requerido_producto,
                (SELECT SUM(cantidad_ingresada) FROM pedidos_carga_productos WHERE codigo_pedido_carga = '${codigoPedidoCarga}' AND codigo_producto = '${codigoProducto}') AS total_ingresado_producto`,
        {type: QueryTypes.SELECT})

        const total_requerido_pedido = totales[0].total_requerido_pedido
        const total_ingresado_pedido = totales[0].total_ingresado_pedido
        const total_requerido_producto = totales[0].total_requerido_producto
        const total_ingresado_producto = totales[0].total_ingresado_producto
        
        let producto_finalizado = false
        let pedido_finalizado = false
        
        if(total_requerido_pedido === total_ingresado_pedido){
            pedido_finalizado = true
        }

        if(total_requerido_producto === total_ingresado_producto){
            producto_finalizado = true
        }

        return res.json({
            producto_finalizado,
            pedido_finalizado,
            cantidadPendiente
        })


    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }
}

exports.actualizarPedidoCargaProductoSeries = async (req, res) => {
    
    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }
    console.log("entra")
    try {

        let {  codigoPedidoCarga, pallet, serieCliente } = req.body;
        //verifica que el pedido a actualizar existe.
        let pedidoCargaProductoSeries = await PedidoCargaProductoSeries.findOne({
            where:{
                codigo_pedido_carga: codigoPedidoCarga,
                etiqueta_pallet: pallet
            }
        });
        if (!pedidoCargaProductoSeries) {
            return res.status(404).send({
                msg: `El pallet ${pallet} no existe en el pedido de carga ${codigoPedidoCarga}`
            })
        }

        //actualiza los datos.
        pedidoCargaProductoSeries = await PedidoCargaProductoSeries.update({
            etiqueta_cliente: serieCliente,
        }, {
            where: {
                codigo_pedido_carga: codigoPedidoCarga,
                etiqueta_pallet: pallet
            }
        })

        res.json(pedidoCargaProductoSeries);

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }
 
}

exports.listarSeriesPedidoCargaPallet = async (req, res) => {
    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }

    try {

        const { codigoPedidoCarga, etiquetaPallet } = req.query;

        const seriesPedidoCargaPallet = await PedidoCargaProductoSeries.findAll({
           /*  include:[{
                model: PedidoCargaProductoSeries,
                attributes: ['descripcion_producto'],
            }], */
            where:{
                codigo_pedido_carga: codigoPedidoCarga,
                etiqueta_pallet: etiquetaPallet
            }
        });

        res.json({
            seriesPedidoCargaPallet
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        });
    }
}

exports.eliminarPedidoCargaProductoSeries = async (req, res) => {

    try{

        const { codigo } = req.params;


        let pedidoCargaProductoSeries = await PedidoCargaProductoSeries.findByPk(codigo);
        if (!pedidoCargaProductoSeries) {
            return res.status(404).send({
                msg: `El pedido carga prodcuto series ${pedidoCargaProductoSeries} no existe`
            })
        }

        //cuento la cantidad de productos ingresados
        const cantidadSeries = await PedidoCargaProductoSeries.count({
            where: {
                codigo_pedido_carga: pedidoCargaProductoSeries.codigo_pedido_carga,
                numero_serie: pedidoCargaProductoSeries.numero_serie
            }
        })

        //obtengo el registro para verificar la cantidad ingresada
        const pedidoCargaCantidad = await PedidoCargaProducto.findOne({
            where:{
                codigo_pedido_carga: pedidoCargaProductoSeries.codigo_pedido_carga
            }
        })

        if(pedidoCargaCantidad.cantidad_requerida === pedidoCargaCantidad.cantidad_ingresada || pedidoCargaCantidad.cantidad_requerida > 0){
            await PedidoCargaProducto.update({
                cantidad_ingresada: cantidadSeries-1,
            }, {
                where: {
                    codigo_pedido_carga: pedidoCargaProductoSeries.codigo_pedido_carga
                }
            })
        } else{
            return res.status(404).send({
                msg: `La cantidad ingresada fue quitada con exito`
            })
        }

        //elimino el registro
        pedidoCargaProductoSeries = await PedidoCargaProductoSeries.destroy({
            where: {
                codigo
            }
        })

        //envío una respuesta informando que el registro fue eliminado
        res.json({
            msg: 'Pedido carga producto series eliminado correctamente'
        });



    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }
}

exports.eliminarPallet = async (req, res) => {


    try{

        const { codigoPedidoCarga, etiquetaPallet } = req.query;


        let pedidoCargaPallet = await PedidoCargaProductoSeries.findOne({
            where:{
                codigo_pedido_carga: codigoPedidoCarga,
                etiqueta_pallet: etiquetaPallet
            }
        })
        if (!pedidoCargaPallet) {
            return res.status(404).send({
                msg: `El pallet ${etiquetaPallet} no existe`
            })
        }

        pedidoCargaPallet = await PedidoCargaProductoSeries.destroy({
            where: {
                codigo_pedido_carga: codigoPedidoCarga,
                etiqueta_pallet: etiquetaPallet
            }
        })

        query = `SELECT 
        pcp.codigo_producto, pcp.descripcion_producto, pcp.cantidad_requerida, pcp.cantidad_ingresada,
        IFNULL((SELECT SUM(cantidad) 
            FROM pedidos_carga_producto_series 
        WHERE codigo_producto = pcp.codigo_producto AND codigo_pedido_carga = '${codigoPedidoCarga}'
        ) , 0) AS series_ingresadas
        FROM pedidos_carga_productos pcp
        WHERE codigo_pedido_carga = '${codigoPedidoCarga}' `
    
        const productos = await sequelize.query(query,{ type: QueryTypes.SELECT });

        
        for(let producto of productos){
            console.log(producto)
            console.log(producto.series_ingresadas)
            await PedidoCargaProducto.update({
                cantidad_ingresada: producto.series_ingresadas
            }, {
                where: {
                    codigo_pedido_carga: codigoPedidoCarga,
                    codigo_producto: producto.codigo_producto
                }
            })
        }

        res.json({
            productos
        })


    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }

}