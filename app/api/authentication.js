// Dependencias
var express = require('express');
var router = express.Router(); // para modularizar las rutas
var Usuario = require('../models/usuario'); // Modelo de la colección "Usuarios"

var jwt = require('jsonwebtoken'); // manejo de autentificación por JSON Web Token
var secret = require('../../config').jwt;

// Ruta para autentificar un usuario (POST http://localhost:8080/api/authenticate)
router.post('/authenticate', function(req, res){
    Usuario.findOne({
        $or: [{email: req.body.name}, {username: req.body.name}]
    }).select('username email password permisos admin').exec(function(err, usuario){
        if(err)
            throw err;

        // no se encontró usuario con ese username/email
        if(!usuario){
            res.status(400).send({
                success: false,
                code: 'username',
                message: 'Nombre de usuario/correo no encontrado'
            });
        }
        else if (usuario) {
            // revisar que el password coincida
            var validPassword = usuario.comparePassword(req.body.password);
            if(!validPassword){
                res.status(400).send({
                    success: false,
                    code: 'password',
                    message: 'La contraseña es incorrecta'
                });
            } else {
                // si existe el usuario y el password es correcto
                // crear token
                var token = jwt.sign({
                    username: usuario.username,
                    email: usuario.email,
                    admin: usuario.admin,
                    permisos: usuario.permisos,
                    id: usuario._id
                }, secret, {
                    expiresIn: '7 days' // expresado en notación de https://github.com/zeit/ms
                });

                // devolver la información del token como JSON
                res.json({
                    success: true,
                    token: token
                });
            }
        }
    });
});

module.exports = router; // Exportar el API para ser utilizado en server.js