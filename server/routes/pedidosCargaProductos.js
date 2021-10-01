const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const { check } = require('express-validator');

const { listarPedidoCargaProductos, actualizarCantidadRequeridaPedidoCargaProductos, getCantidadesPedidoCargaProducto } = require('../controllers/pedidoCargaProductoController');

router.get('/listar', auth, [
    check('codigoPedidoCarga').exists().withMessage('El código pedido carga es obligatorio').notEmpty().withMessage('El código pedido carga no debe ser vacío'),
], listarPedidoCargaProductos);

router.put('/actualizar', auth, [
    check('codigoPedidoCarga').exists().withMessage('El código pedido carga es obligatorio').notEmpty().withMessage('El código pedido carga no debe ser vacío'),
    check('codigoProducto').exists().withMessage('El código producto es obligatorio').notEmpty().withMessage('El código producto no debe ser vacío'),
    check('descripcionProducto').exists().withMessage('La descripción producto es obligatoria').notEmpty().withMessage('La descripción producto no debe ser vacía'),
    check('cantidadIngresada').exists().withMessage('La cantidad ingresada es obligatoria').notEmpty().withMessage('La cantidad ingresada no debe ser vacía'),
], actualizarCantidadRequeridaPedidoCargaProductos);

router.get('/cantidades', auth, [
    check('codigoPedidoCarga').exists().withMessage('El código pedido carga es obligatorio').notEmpty().withMessage('El código pedido carga no debe ser vacío'),
    check('codigoProducto').exists().withMessage('El código producto es obligatorio').notEmpty().withMessage('El código producto no debe ser vacío'),

], getCantidadesPedidoCargaProducto)


module.exports = router;