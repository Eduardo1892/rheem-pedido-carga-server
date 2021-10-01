const express = require('express');
const app = express();

app.use('/api/auth/', require('./auth'));
app.use('/api/usuarios/', require('./usuarios'));
app.use('/api/pedido-carga/', require('./pedidosCarga'));
app.use('/api/pedido-carga-tracking/', require('./pedidosCargaTracking'));
app.use('/api/pedido-carga-producto/', require('./pedidosCargaProductos'));
app.use('/api/rol/', require('./roles'));
app.use('/api/usuario-roles/', require('./usuarioRoles')); 
app.use('/api/pedido-carga-producto-series/', require('./pedidosCargaProductoSeries'));
app.use('/api/rol-estados/', require('./rolEstados'))


module.exports = app;