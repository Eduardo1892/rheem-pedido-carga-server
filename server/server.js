const express = require('express')
const cors = require('cors')
const app = express()

if(process.env.NODE_ENV === 'dev'){
    require('dotenv').config({ path: './.env.development' })
}else{
    require('dotenv').config({ path: './.env.production' })
}

const { sequelize } = require('./database/db')
 
const PORT = process.env.PORT || 3000



//habilitar express.json.
app.use(require('express').json({ extended: true, limit: '150mb' }))
//habilitar cors.
app.use(cors('*'))
//cargar rutas apirest
app.use(require('./routes/index'))

//inicializa el servidor
app.listen(PORT, () => {
    console.log("La aplicacion está corriendo en el puerto: "+ PORT )

    sequelize.sync({ force: Number(process.env.DB_FORCE) }).then(async() => {

        console.log('Se estableció la conexión a la base de datos')

    })
})