/*
API para manejo de la base de datos con la colección de "ConjuntoDocumental"
Permite obtener datos en formato JSON mediante HTTP (GET, POST, PUT, DELETE)

Las rutas aqui definidas son un router que le antecede una ruta general de uso (ver server.js)
Por ejemplo:
GET    http://localhost:8080/api/conjuntoDocumental
POST   http://localhost:8080/api/conjuntoDocumental
GET    http://localhost:8080/api/conjuntoDocumental/1234567890
PUT    http://localhost:8080/api/conjuntoDocumental/1234567890
DELETE http://localhost:8080/api/conjuntoDocumental/1234567890
*/

// Dependencias
var express = require('express');
var mongoose = require('mongoose');
var router = express.Router(); // para modularizar las rutas
var ConjuntoDocumental = require('../models/conjuntoDocumental'); // Modelo de la colección "ConjuntoDocumental"
var verifyToken = require('./token'); // Función de verificación de token

// // Función a realizar siempre que se utilize esta API
// router.use(function(req, res, next){
//     // Rutas que son excluidas de verificación de token:
//     if(req.method === 'GET')
//         return next();
//     // Antes de usar el API de usuario se verifica que haya token y sea válido
//     verifyToken(req, res, next);
// });

// En peticiones a la raiz del API
router.route('/')
	// Obtener todos los conjuntos documentales
	.get(function(req, res){

        ConjuntoDocumental.find() // encontrar todos
        //.sort({fecha: 'desc'})
        .exec(function(err, conjuntos){
            if(err)
                return res.send(err);
            res.send(conjuntos);
        });

    })

    // Agregar un nuevo conjunto documental
    .post(function(req, res){
        var conjunto = new ConjuntoDocumental();
        
        // You can check specific properties before update
        if(req.body)
            conjunto = new ConjuntoDocumental(req.body);

        conjunto.save(function(err){
            if(err)
                return res.send(err);
            res.json({
                success: true, 
                message: 'Se ha creado correctamente el conjunto documental "' + conjunto.identificacion.titulo + '"', 
                data: conjunto
            });
        })
    })

// En peticiones con un ID
router.route('/:conjunto_id')
	// Obtener un conjunto documental particular (mediante el ID)
    .get(function(req, res){
        ConjuntoDocumental.findById(req.params.conjunto_id)
        .exec(function(err, conjunto){
            if(err)
                return res.send(err);
            res.json(conjunto);
        })
    })

    // Actualizar un conjunto en particular (mediante el ID)
    .put(function(req, res){
        ConjuntoDocumental.findById(req.params.conjunto_id, function(err, conjunto){
            if(err)
                return res.send(err);
            
            // You can check specific properties before update
            conjunto.save(function(err){
                if(err)
                    return res.send(err);
                res.json({success: true, message: 'Se ha modificado la información del conjunto documental "' + conjunto.identificacion.titulo + '"'});
            });
        });
    })

    // Eliminar un conjunto documental en particular (mediante el ID)
    .delete(function(req, res){
        ConjuntoDocumental.remove({
            _id: req.params.conjunto_id
        }, function(err, conjunto){
            if(err)
                return res.send(err);
            res.json({success: true, message: 'Se ha borrado la información del conjunto documental "' + conjunto.identificacion.titulo + '"'});
        });
    })

module.exports = router; // Exponer el API para ser utilizado en server.js