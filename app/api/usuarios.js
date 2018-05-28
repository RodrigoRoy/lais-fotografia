/*
API para manejo de la base de datos con la colección de "Usuarios"
Permite obtener datos en formato JSON mediante verbos HTTP (GET, POST, PUT, DELETE)

Las rutas aqui definidas son un router que le antecede una ruta general de uso (ver server.js)
Por ejemplo:
GET    http://localhost:8080/api/usuarios
POST   http://localhost:8080/api/usuarios
GET    http://localhost:8080/api/usuarios/1234567890
PUT    http://localhost:8080/api/usuarios/1234567890
DELETE http://localhost:8080/api/usuarios/1234567890
*/

// Dependencias
var express = require('express');
var router = express.Router(); // para modularizar las rutas
var Usuario = require('../models/usuario'); // Modelo de la colección "Usuarios"
var verifyToken = require('./token'); // Función de verificación de token

//Función a realizar siempre que se utilize esta API
router.use(function(req, res, next){
    // Antes de usar el API de usuario se verifica que haya token y sea válido
    verifyToken(req, res, next);
});

// obtener la información del usuario autentificado
router.get('/me', function(req, res){
    res.send(req.decoded);
});

// En peticiones a la raiz del API
router.route('/')
	// Obtener todos los usuarios
	.get(function(req, res){
        Usuario.find()
        // .lean() // Convierte los resultados a JSON (en vez de MongooseDocuments donde no se pueden incluir propiedades)
        .exec(function(err, usuarios){
            if(err)
                return res.send(err);
            return res.json(usuarios);
        });
    })

    // Agregar un nuevo usuario
    .post(function(req, res){
        var usuario = new Usuario();
        if(req.body.username)
            usuario.username = req.body.username;
        if(req.body.fullname)
            usuario.fullname = req.body.fullname;
        if(req.body.password)
            usuario.password = req.body.password;
        if(req.body.email)
            usuario.email = req.body.email;
        if(req.body.permisos)
            usuario.permisos = req.body.permisos;
        if(req.body.admin)
            usuario.admin = req.body.admin;
        // if(req.body.active)
        //     usuario.active = req.body.active;

        usuario.save(function(err){
            if(err){
                if(err.code == 11000)
                    return res.status(400).send({success: false, message: 'Un usuario con ese nombre ya existe.'});
                else
                    return res.status(400).send({success: false, message: 'Error en la base de datos.', error: err});
            }

            return res.json({success: true, message: 'Usuario creado'});
        });
    });

// En peticiones con un ID
router.route('/:usuario_id')
	// Obtener un usuario particular (mediante el ID)
    .get(function(req, res){
        Usuario.findById(req.params.usuario_id, function(err, usuario){
            if(err)
                return res.send(err);
            return res.json(usuario);
        })
    })

    // Actualizar un usuario en particular (mediante el ID)
    .put(function(req, res){
        Usuario.findById(req.params.usuario_id, function(err, usuario){
            if(err)
                return res.send(err);
            
            // Actualizar todos los campos no-vacios
            if(req.body.username != usuario.username)
                usuario.username = req.body.username;
            if(req.body.fullname != usuario.fullname)
                usuario.fullname = req.body.fullname;
            if(req.body.password != usuario.password)
                usuario.password = req.body.password;
            if(req.body.email != usuario.email)
                usuario.email = req.body.email;
            if(req.body.permisos != usuario.permisos)
                usuario.permisos = req.body.permisos;
            if(req.body.admin != usuario.admin)
                usuario.admin = req.body.admin;
            // if(req.body.active != usuario.active)
            //     usuario.active = req.body.active;

            usuario.save(function(err){
                if(err)
                    return res.send(err);
                return res.json({success: true, message: 'Usuario actualizado'});
            });
        });
    })

    // Eliminar un usuario en particular (mediante el ID)
    .delete(function(req, res){
        Usuario.remove({
            _id: req.params.usuario_id
        }, function(err, usuario){
            if(err)
                return res.send(err);
            return res.json({success: true, message: 'Usuario borrado exitosamente'});
        });
    })

module.exports = router; // Exportar el API para ser utilizado en server.js