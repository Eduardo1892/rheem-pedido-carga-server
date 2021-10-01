const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const { body, check, query } = require('express-validator');

const { crearUsuarioRol, listarUsuarioRol, eliminarUsuarioRol } = require('../controllers/usuarioRolController');

router.post('/crear', auth, [
    check('codigoUsuario').exists().withMessage('El código usuario es obligatorio').notEmpty().withMessage('El código usuario no debe ser vacío'),
    check('codigoRol').exists().withMessage('El código rol es obligatorio').notEmpty().withMessage('El código rol no debe ser vacío'),
], crearUsuarioRol);

router.get('/listar', listarUsuarioRol)

router.delete('/eliminar/:codigo', auth, eliminarUsuarioRol);

module.exports = router;