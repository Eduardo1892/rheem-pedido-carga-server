const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const { body, check, query } = require('express-validator');

const { crearRol, listarRoles, actualizarRol, eliminarRol } = require('../controllers/rolController');

router.post('/crear', auth, [
    check('descripcion').exists().withMessage('La descripción es obligatoria').notEmpty().withMessage('La descripción no debe ser vacía'),
    check('codigoEstado').exists().withMessage('El código estado es obligatorio').notEmpty().withMessage('El código estado no debe ser vacío'),
], auth, crearRol);

router.get('/listar', auth, [
    query('filtro').exists().withMessage('El filtro es obligatorio').notEmpty().withMessage('El filtro no debe ser vacío'),
], listarRoles);

router.put('/actualizar', auth, [
    check('codigo').exists().withMessage('El código es obligatorio').notEmpty().withMessage('El código no debe ser vacío'),
    check('descripcion').exists().withMessage('La descripción es obligatoria').notEmpty().withMessage('La descripción no debe ser vacía'),
    check('codigoEstado').exists().withMessage('El código estado es obligatorio').notEmpty().withMessage('El código estado no debe ser vacío'),
], auth, actualizarRol);

router.delete('/eliminar/:codigo', auth, eliminarRol);

module.exports = router;