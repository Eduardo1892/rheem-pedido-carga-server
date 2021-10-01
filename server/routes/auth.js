const express = require('express');
const router = express.Router();
const { autenticarUsuario, datosUsuarioAutenticado } = require('../controllers/authController');
const { check } = require('express-validator');
const auth = require('../middleware/auth');


router.post('/', autenticarUsuario, [
    check('codigo').exists().withMessage('El código es obligatorio').notEmpty().withMessage('El código no debe ser vacío'),
    check('clave').exists().withMessage('La clave obligatoria').notEmpty().withMessage('La clave no debe ser vacía'),
])
router.get('/datos', auth, datosUsuarioAutenticado);

module.exports = router;
