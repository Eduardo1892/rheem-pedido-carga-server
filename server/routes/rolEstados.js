const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const { body, check, query } = require('express-validator');

const { listarRolEstados } = require('../controllers/rolEstadosController');


router.get('/listar', listarRolEstados)


module.exports = router;