const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const { body, check, query } = require('express-validator');

const { crearUsuario, listarUsuarios, actualizarUsuario, eliminarUsuario } = require('../controllers/usuarioController');

router.post('/crear',[
    //check('codigo', 'El código es obligatorio.').notEmpty().isLength({ min: 8, max: 9 }).withMessage('El código no es válido.'),
    check('codigo').exists().withMessage('El código es obligatorio').notEmpty().withMessage('El código no debe ser vacío'),
    check('clave').exists().withMessage('La clave es obligatoria').notEmpty().withMessage('La clave no debe ser vacía'),
    check('nombre').exists().withMessage('El nombre es obligatorio').notEmpty().withMessage('El nombre no debe ser vacío'),
    check('email').exists().withMessage('El email es obligatorio').notEmpty().isEmail().withMessage('No es un email válido'),
], crearUsuario);

router.get('/listar', auth, [
    query('filtro').exists().withMessage('El filtro es obligatorio').notEmpty().withMessage('El filtro no debe ser vacío'),
],listarUsuarios);

router.put('/actualizar', auth, [
    
    check('codigo').exists().withMessage('El código es obligatorio').notEmpty().withMessage('El código no debe ser vacío'),
    check('clave').exists().withMessage('La clave es obligatoria').notEmpty().withMessage('La clave no debe ser vacía'),
    check('nombre').exists().withMessage('El nombre es obligatorio').notEmpty().withMessage('El nombre no debe ser vacío'),
    check('email').exists().withMessage('El email es obligatorio').notEmpty().isEmail().withMessage('No es un email válido'),
], actualizarUsuario);

router.delete('/eliminar/:codigo', auth, eliminarUsuario);

module.exports = router;