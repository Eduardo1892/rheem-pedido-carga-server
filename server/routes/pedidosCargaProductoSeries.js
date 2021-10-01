const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const { crearPedidoCargaProductoSeries, eliminarPedidoCargaProductoSeries, 
    actualizarPedidoCargaProductoSeries, 
    listarSeriesPedidoCargaPallet, eliminarPallet
} = require('../controllers/pedidoCargaProductoSeriesController');
const { check, query } = require('express-validator');


router.post('/crear', auth, [
    check('codigoPedidoCarga').exists().withMessage('El código pedido carga es obligatorio').notEmpty().withMessage('El código pedido carga no debe ser vacío'),
    check('codigoProducto').exists().withMessage('El código producto es obligatorio').notEmpty().withMessage('El código producto no debe ser vacío'),
    check('numeroSerie').exists().withMessage('El número serie es obligatorio'),
], crearPedidoCargaProductoSeries);


router.get('/listar', auth, [
    query('codigoPedidoCarga').exists().withMessage('El código pedido carga es obligatorio').notEmpty().withMessage('El código pedido carga no debe ser vacío'),
    query('etiquetaPallet').exists().withMessage('La etiqueta pallet es obligatoria').notEmpty().withMessage('La etiqueta pallet no debe ser vacía'),
], listarSeriesPedidoCargaPallet)

router.delete('/eliminar/:codigo', auth, eliminarPedidoCargaProductoSeries);

router.put('/actualizar', auth, [
    check('codigoPedidoCarga').exists().withMessage('El código pedido carga es obligatorio').notEmpty().withMessage('El código pedido carga no debe ser vacío'),
    check('pallet').exists().withMessage('El código pallet es obligatorio').notEmpty().withMessage('El código pallet no debe ser vacío'),
    check('serieCliente').exists().withMessage('El número serie cliente es obligatorio').notEmpty().withMessage('El número serie no debe ser vacío'),
], actualizarPedidoCargaProductoSeries)

router.delete('/eliminar-pallet', auth, eliminarPallet);


module.exports = router;
