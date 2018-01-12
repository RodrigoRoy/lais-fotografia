/*
API para manejo de la base de datos con la colección de "UnidadDocumental"
Permite obtener datos en formato JSON mediante HTTP (GET, POST, PUT, DELETE)

Las rutas aqui definidas son un router que le antecede una ruta general de uso (ver server.js)
Por ejemplo:
GET    http://localhost:8080/api/unidadDocumental
POST   http://localhost:8080/api/unidadDocumental
GET    http://localhost:8080/api/unidadDocumental/1234567890
PUT    http://localhost:8080/api/unidadDocumental/1234567890
DELETE http://localhost:8080/api/unidadDocumental/1234567890
*/

// Dependencias
var express = require('express');
var mongoose = require('mongoose');
var router = express.Router(); // para modularizar las rutas
var UnidadDocumental = require('../models/unidadDocumental'); // Modelo de la colección "UnidadDocumental"
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
	// Obtener todas las unidades documentales
	.get(function(req, res){

        UnidadDocumental.find() // encontrar todos
        //.sort({fecha: 'desc'})
        .exec(function(err, unidades){
            if(err)
                return res.send(err);
            res.send(unidades);
        });

    })

    // Agregar una nueva unidad documental
    .post(function(req, res){
        var unidad = new UnidadDocumental();
        
        // You can check specific properties before update
        if(req.body)
            unidad = new UnidadDocumental(req.body);

        unidad.save(function(err){
            if(err)
                return res.send(err);
            res.json({
                success: true,
                message: 'Se ha creado correctamente la unidad documental con código de referencia "' + unidad.identificacion.codigoReferencia + '"',
                data: unidad
            });
        })
    })

// En peticiones con un ID
router.route('/:unidad_id')
	// Obtener una unidad documental particular (mediante el ID)
    .get(function(req, res){
        UnidadDocumental.findById(req.params.unidad_id)
        .exec(function(err, unidad){
            if(err)
                return res.send(err);
            res.json(unidad);
        })
    })

    // Actualizar una unidad en particular (mediante el ID)
    .put(function(req, res){
        UnidadDocumental.findById(req.params.unidad_id, function(err, unidad){
            if(err)
                return res.send(err);
            
            // You can check specific properties before update
            if(req.body.identificacion)
                unidad.identificacion = req.body.identificacion;
            if(req.body.contenidoEstructura)
                unidad.contenidoEstructura = req.body.contenidoEstructura;
            if(req.body.caracteristicasFisicas)
                unidad.caracteristicasFisicas = req.body.caracteristicasFisicas;
            if(req.body.documentacionAsociada)
                unidad.documentacionAsociada = req.body.documentacionAsociada;
            if(req.body.publicaciones)
                unidad.publicaciones = req.body.publicaciones;
            if(req.body.controlDescripcion)
                unidad.controlDescripcion = req.body.controlDescripcion;
            if(req.body.adicional)
                unidad.adicional = req.body.adicional;

            unidad.save(function(err){
                if(err)
                    return res.send(err);
                res.json({success: true, message: 'Se ha modificado la información de la unidad documental "' + unidad.identificacion.codigoReferencia + '"'});
            });
        });
    })

    // Eliminar una unidad documental en particular (mediante el ID)
    .delete(function(req, res){
        UnidadDocumental.remove({
            _id: req.params.unidad_id
        }, function(err, unidad){
            if(err)
                return res.send(err);
            res.json({success: true, message: 'Se ha borrado la información de la unidad documental "' + unidad.identificacion.codigoReferencia + '"'});
        });
    })

module.exports = router; // Exponer el API para ser utilizado en server.js