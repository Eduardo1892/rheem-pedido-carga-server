const { Usuario, UsuarioRol, Rol } = require('../database/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.autenticarUsuario = async (req,res) =>{

    try { 

        const { codigo, clave, codigoRol } = req.body

        //revisa que el usuario existe
        let usuario = await Usuario.findByPk(codigo);
        if (!usuario) {
            return res.status(400).json({
                msg: 'El usuario no existe'
            })
        }
    
        //revisar que el usuario no se encuentre inactivo
        if(usuario.inactivo){
            return res.status(401).json({
                msg: 'El usuario se encuentra inactivo'
            })
        }
        
        //revisar el password ingresado vs el password de la bd
        const passCorrecto = await bcrypt.compare(clave, usuario.clave)
        if(!passCorrecto){
            return res.status(401).json({
                msg: 'El password es incorrecto'
            })
        }

        const usuarioRol = await UsuarioRol.findOne({
            where:{
                codigo_usuario: codigo,
                codigo_rol: codigoRol,
            }
        })
        
        if(!usuarioRol){
            return res.status(400).json({
                msg:'El rol seleccionado no corresponde al usuario'
            })
        }
        
        //si el usuario es válido crear y firmar el jsonwebtoken
        const payload = {
            usuario: {
                codigo: usuario.codigo,
                codigoRol: usuarioRol.codigo_rol
            }
        }
        // //Obtiene el tiempo de expiracion del token.
        // const token = await Configuracion.findOne({
        //     where: {
        //         seccion: 'TOKEN',
        //         clave: 'EXPIRA'
        //     }
        // })

        //firmar el jsonwebtoken 
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 86400, //86400 segundos 1 día.
        }, (error, token) => {
            if (error) throw error
            res.json({ token })
        })

    } catch (error) {
        console.log(error)
        res.status(400).send('Hubo un error')
    }

}

exports.datosUsuarioAutenticado = async (req, res) => {

    try {
        //obtiene el parametro desde la url
        const {codigo, codigoRol} = req.usuario

        //consulta por el usuario
        const usuario = await Usuario.findByPk(codigo, {
            attributes: { exclude: ['clave', 'createdAt', 'updatedAt'] },
            raw: true,
            nested: false,
        });

        //si el usuario no existe
        if(!usuario){
            return res.status(404).json({
                msg: `El usuario ${codigo} no existe`
            })
        }
        
        const rol = await Rol.findByPk(codigoRol)

        if(!rol){
            return res.status(404).json({
                msg: `El rol ${codigoRol} no existe`
            })
        }

        //envia la información del usuario
        res.json({
            usuario,
            rol
        })
       

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }
    
}

