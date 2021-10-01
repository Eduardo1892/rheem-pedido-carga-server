const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const { check } = require('express-validator');

const { crearPedidoCargaTracking } = require('../controllers/pedidoCargaTrackingController');

router.post('/crear', auth, [
    check('codigoPedidoCarga').exists().withMessage('El código pedido carga es obligatorio').notEmpty().withMessage('El código pedido carga no debe ser vacío'),
    check('codigoUsuario').exists().withMessage('El código usuario es obligatorio').notEmpty().withMessage('El código usuario no debe ser vacío'),
    check('codigoEstado').exists().withMessage('El código estado es obligatorio').notEmpty().withMessage('El código estado no debe ser vacío'),
], crearPedidoCargaTracking);



module.exports = router;