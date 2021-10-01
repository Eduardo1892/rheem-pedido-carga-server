const {  PedidoCargaProducto, sequelize } = require('../database/db');
const { Sequelize, QueryTypes } = require('sequelize')
//llama el resultado de la validación
const { validationResult } = require('express-validator');

exports.listarPedidoCargaProductos = async (req, res) => {

    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }

    try{

        const { codigoPedidoCarga } = req.query;

        //Listo los productos de un pedido de carga
        let pedidoCargaProductos = await PedidoCargaProducto.findAll({
            where: {
                codigo_pedido_carga: codigoPedidoCarga,
            },
            order: [
                ['descripcion_producto', 'ASC']
            ]
        })
        
        res.json({
            pedidoCargaProductos
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }

}

exports.actualizarCantidadRequeridaPedidoCargaProductos = async (req, res) => {

    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }

    try{

        const { codigoPedidoCarga, codigoProducto, descripcionProducto,cantidadIngresada } = req.body;

        //verifico si el registro existe
        let pedidoCargaProductos = await PedidoCargaProducto.findOne({
            where: {
                codigo_pedido_carga: codigoPedidoCarga,
                codigo_producto: codigoProducto
            }
        })
        
        //extraigo las cantidades reuqerida e ingresada
        const cantidadRequerida = pedidoCargaProductos.cantidad_requerida
        const cantidadIngresadaActual = pedidoCargaProductos.cantidad_ingresada
        
        //sumo la cantidad ingresada anteriormente a la que se ingresará 
        const cantidadIngresadaFinal = Number(cantidadIngresadaActual)+Number(cantidadIngresada)
      

        if(cantidadRequerida < cantidadIngresadaFinal){
            return res.status(400).json({
                msg: 'La cantidad ingresada está superando a la cantidad requerida'
            });
        }else{
            pedidoCargaProductos = await PedidoCargaProducto.update({
                cantidad_ingresada: cantidadIngresadaFinal,
    
            }, {
                where: {
                    codigo_pedido_carga: codigoPedidoCarga,
                    codigo_producto: codigoProducto,
                    descripcion_producto: descripcionProducto,
                }
            })


        }

        const totales = await sequelize.query(`
            SELECT 
                (SELECT SUM(cantidad_requerida) FROM pedidos_carga_productos WHERE codigo_pedido_carga = '${codigoPedidoCarga}') AS total_requerido,
                (SELECT SUM(cantidad_ingresada) FROM pedidos_carga_productos WHERE codigo_pedido_carga = '${codigoPedidoCarga}') AS total_ingresado`,
        {type: QueryTypes.SELECT})

            const total_requerido = totales[0].total_requerido
            const total_ingresado = totales[0].total_ingresado
        

        if(total_requerido === total_ingresado){
            return res.json({
                pedido_completo: true,
                msg: 'Pedido completo'
            })
        }else{
            return res.json({
                    pedido_completo: false,
                    msg: 'Cantidad ingresada correctamente'
            })
        }
    
    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }






}

exports.getCantidadesPedidoCargaProducto = async (req, res) => {

      //si hay errores de la validación
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
      }
  
      try{
  
          const { codigoPedidoCarga, codigoProducto } = req.query;
  
          //Listo los productos de un pedido de carga
          let cantidadesPedidoCargaProducto = await PedidoCargaProducto.findOne({
              attributes: ['cantidad_requerida', 'cantidad_ingresada'],
              where: {
                  codigo_pedido_carga: codigoPedidoCarga,
                  codigo_producto: codigoProducto,
              }
          })
          
          res.json({
            cantidadesPedidoCargaProducto
          })
  
      } catch (error) {
          console.log(error);
          res.status(500).send({
              msg: 'Hubo un error, por favor vuelva a intentar'
          })
      }
  
}
