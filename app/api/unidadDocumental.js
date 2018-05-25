'use strict';
/*
API para manejo de la base de datos con la colección de "UnidadDocumental"
Permite obtener datos en formato JSON mediante HTTP (GET, POST, PUT, DELETE)

Las rutas aqui definidas son un router que le antecede una ruta general de uso (ver server.js)
Por ejemplo:
GET    http://localhost:8080/api/unidadDocumental
POST   http://localhost:8080/api/unidadDocumental
GET    http://localhost:8080/api/unidadDocumental/prefix
GET    http://localhost:8080/api/unidadDocumental/next
GET    http://localhost:8080/api/unidadDocumental/1234567890
PUT    http://localhost:8080/api/unidadDocumental/1234567890
DELETE http://localhost:8080/api/unidadDocumental/1234567890
GET    http://localhost:8080/api/unidadDocumental/1234567890/suffix
*/

// Dependencias
var express = require('express');
var mongoose = require('mongoose');
var config = require('../../config');
var prefijo = config.prefix;
var router = express.Router(); // para modularizar las rutas
var UnidadDocumental = require('../models/unidadDocumental'); // Modelo de la colección "UnidadDocumental"
var ConjuntoDocumental = require('../models/conjuntoDocumental'); // Modelo de la colección "ConjuntoDocumental"
var verifyToken = require('./token'); // Función de verificación de token

// Función a realizar siempre que se utilize esta API
router.use(function(req, res, next){
    // Rutas que son excluidas de verificación de token:
    if(req.method === 'GET')
        return next();
    // Antes de usar el API de usuario se verifica que haya token y sea válido
    verifyToken(req, res, next);
});

// En peticiones a la raiz del API
router.route('/')
	// Obtener todas las unidades documentales
	.get(function(req, res){
        // Obtener todas las unidades documentales de un cierto conjunto documental
        // El parámetro 'from' nos indica la numeración del conjunto de pertenencia deseado
        if(req.query.from){
            let regex = new RegExp('^' + prefijo + '-' + req.query.from + '-(\\d+)$');
            UnidadDocumental.
                find({'identificacion.codigoReferencia': regex}).
                exec(function(err, unidades){
                    if(err)
                        return res.send(err);
                    let unidadesOrdenadas = unidades;
                    unidadesOrdenadas.sort(function(a,b){
                        var first = parseInt(/(\d+)$/.exec(a.identificacion.codigoReferencia)[1]),
                            second = parseInt(/(\d+)$/.exec(b.identificacion.codigoReferencia)[1]);
                        return first-second;
                    });
                    res.send(unidades);
                });
        }
        else{
            UnidadDocumental.find() // encontrar todos
            //.sort({fecha: 'desc'})
            .exec(function(err, unidades){
                if(err)
                    return res.send(err);
                res.send(unidades);
            });
        }
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
    });

// Obtener el prefijo común a todas los unidades (por ejemplo: MXIM)
router.route('/prefix')
    .get(function(req, res){
        return res.send({prefijo: prefijo});
    });

// Obtiene la información sobre qué numeración continua al desear crear una nueva unidad documental
// Se debe incluir el parámetro "from" para indicar el conjunto documental de pertenencia
// Por ejemplo: GET http://localhost:8080/api/unidadDocumental/next?from=3-1
// El resultado es un objeto con las propiedades {"next", "str"} que indica el número consecutivo y su representación en texto
// Ejemplo: {"next": 4, "str": "MXIM-3-1-4"}
router.route('/next')
    .get(function(req, res){
        if(!req.query.from)
            return res.status(400).send({success: false, message: 'No se especifica el parámetro del conjunto documental (?from=)'});
        var regex = new RegExp('^' + prefijo + '-' + req.query.from + '-(\\d+)$');
        UnidadDocumental.
            find({'identificacion.codigoReferencia': regex}).
            select({'identificacion.codigoReferencia': 1}).
            exec(function(err, unidades){
                if(err)
                    return res.send(err);
                var numeracion = [], result, number = 0;
                for(var i in unidades){
                    result = regex.exec(unidades[i].identificacion.codigoReferencia);
                    numeracion.push(parseInt(result[1]));
                }
                numeracion.sort(function(a,b){return a-b});
                for(var i in numeracion)
                    if(parseInt(i)+1 != numeracion[i])
                        return res.send({next: parseInt(i)+1, str: prefijo + '-' + req.query.from + '-' + (parseInt(i)+1)});
                return res.send({next: numeracion.length+1, str: prefijo + '-' + req.query.from + '-' + (numeracion.length+1)});
            });
    });

// En peticiones con un ID
router.route('/:unidad_id')
	// Obtener una unidad documental particular (mediante el ID)
    .get(function(req, res){
        UnidadDocumental.findById(req.params.unidad_id)
        .exec(function(err, unidad){
            if(err)
                return res.send(err);
            res.json(unidad);
        });
    })

    // Actualizar una unidad en particular (mediante el ID)
    .put(function(req, res){
        UnidadDocumental.findById(req.params.unidad_id, function(err, unidad){
            if(err)
                return res.send(err);
            
            // You can check specific properties before update
            if(req.body.identificacion)
                unidad.identificacion = req.body.identificacion;
            if(req.body.estructuraContenido)
                unidad.estructuraContenido = req.body.estructuraContenido;
            if(req.body.caracteristicasFisicas)
                unidad.caracteristicasFisicas = req.body.caracteristicasFisicas;
            if(req.body.documentacionAsociada)
                unidad.documentacionAsociada = req.body.documentacionAsociada;
            if(req.body.publicaciones)
                unidad.publicaciones = req.body.publicaciones;
            if(req.body.notas)
                unidad.notas = req.body.notas;
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
        }, function(err){
            if(err)
                return res.send(err);
            res.json({success: true, message: 'Se ha borrado la información de la unidad documental'});
        });
    });

// En peticiones especiales para obtener sufijo
router.route('/:unidad_id/suffix')
    // Obtener una unidad documental particular (mediante el ID)
    .get(function(req, res){
        UnidadDocumental.findById(req.params.unidad_id)
        .select({'identificacion.codigoReferencia': 1})
        .exec(function(err, unidad){
            if(err)
                return res.send(err);
            let regex = new RegExp('^' + prefijo + '-(.*)$');
            let result = regex.exec(unidad.identificacion.codigoReferencia);
            return res.send({sufijo: result[1]});
        });
    });

module.exports = router; // Exponer el API para ser utilizado en server.js