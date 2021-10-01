const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, query } = require('express-validator');

const { crearPedidoCarga, listarPedidosCarga, 
    listarPedidosCargaEstadoUsuario, datosPedidosCarga,
    actualizarPatente
} = require('../controllers/pedidoCargaController');

router.post('/crear',[
    check('ordenVenta').exists().withMessage('La orden venta es obligatoria').notEmpty().withMessage('La orden venta no debe ser vacía'),
    check('ordenCompra').exists().withMessage('La orden compra es obligatoria').notEmpty().withMessage('La orden compra no debe ser vacía'),
    check('rutCliente').exists().withMessage('El Rut cliente es obligatorio').notEmpty().withMessage('El Rut cliente no debe ser vacío'),
    check('nombreCliente').exists().withMessage('El nombre cliente es obligatorio').notEmpty().withMessage('El nombre cliente no debe ser vacío'),
    check('fecha').exists().withMessage('La fecha es obligatoria').notEmpty().withMessage('La fecha no debe ser vacía'),
], auth, crearPedidoCarga);

router.get('/listar',  auth, [
    query('codigoPedidoCarga').exists().withMessage('El código pedido carga es obligatorio').notEmpty().withMessage('El código pedido carga no debe ser vacío'),
],listarPedidosCarga);

router.get('/listar-pedidos-carga-estado-usuario', auth, [
    query('codigoEstado').exists().withMessage('El código estado es obligatorio').notEmpty().withMessage('El código estado no debe ser vacío'),
    query('codigoUsuario').exists().withMessage('El código usuario es obligatorio').notEmpty().withMessage('El código usuario no debe ser vacío'),
], listarPedidosCargaEstadoUsuario);

router.get('/datos', auth, [
    query('codigoPedidoCarga').exists().withMessage('El código pedido carga es obligatorio').notEmpty().withMessage('El código pedido carga no debe ser vacío'),
], datosPedidosCarga);

router.put('/actualizar-patente', auth, [
    check('codigo').exists().withMessage('El código es obligatorio').notEmpty().withMessage('El código no debe ser vacío'),
    check('patente').exists().withMessage('La patente es obligatoria').notEmpty().withMessage('La patente no debe ser vacía'),
],actualizarPatente)


module.exports = router;