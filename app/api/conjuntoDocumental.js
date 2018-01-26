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
var config = require('../../config');
var prefijo = config.prefix;
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
    });

// En peticiones específicas

// Obtener el prefijo común a todos los conjuntos (por ejemplo: MXIM)
router.route('/prefix')
    .get(function(req, res){
        res.send({prefijo: prefijo});
    });

// Obtiene un arreglo de todos los subconjuntos contenido en un conjunto en particular.
// Se debe incluir el parámetro "prefix" para indicar la numeración del conjunto documental
// Por ejemplo: GET http://localhost:8080/api/conjuntoDocumental/contains?prefix=3-1
// El resultado es un objeto con la propiedad "subconjuntos" que es un arreglo de objetos: {"_id", "codigoReferencia"}
router.route('/contains')
    .get(function(req,res){
        var regex = req.query.prefix ? new RegExp('^' + prefijo + '-' + req.query.prefix + '-(\\d+)$') : new RegExp('^' + prefijo + '-(\\d+)$');
        ConjuntoDocumental.
            find({'identificacion.codigoReferencia': regex}).
            select({'identificacion.codigoReferencia': 1}).
            exec(function(err, conjuntos){
                if(err)
                    return res.send(err);
                var subconjuntos = [];
                for(var i in conjuntos)
                    subconjuntos.push({
                        _id: conjuntos[i]._id,
                        codigoReferencia: conjuntos[i].identificacion.codigoReferencia
                    });
                subconjuntos.sort(function(a,b){
                    var first = parseInt(/(\d+)$/.exec(a.codigoReferencia)[1]),
                        second = parseInt(/(\d+)$/.exec(b.codigoReferencia)[1]);
                    return first-second;
                });
                res.send({subconjuntos});
            })
    });

// Obtiene la información sobre qué numeración continua al desear crear un nuevo conjunto documental
// Se debe incluir el parámetro "prefix" para indicar la numeración del conjunto documental
// Por ejemplo: GET http://localhost:8080/api/conjuntoDocumental/next?prefix=3-1
// El resultado es un objeto con las propiedades {"next", "str"} que indica el número consecutivo y su representación en texto
// Ejemplo: {"next": 4, "str": "MXIM-3-1-4"}
router.route('/next')
    .get(function(req, res){
        var regex = req.query.prefix ? new RegExp('^' + prefijo + '-' + req.query.prefix + '-(\\d+)$') : new RegExp('^' + prefijo + '-(\\d+)$');
        ConjuntoDocumental.
            find({'identificacion.codigoReferencia': regex}).
            select({'identificacion.codigoReferencia': 1}).
            exec(function(err, conjuntos){
                if(err)
                    return res.send(err);
                var numeracion = [], result, number = 0;
                for(var i in conjuntos){
                    result = regex.exec(conjuntos[i].identificacion.codigoReferencia);
                    numeracion.push(parseInt(result[1]));
                }
                numeracion.sort(function(a,b){return a-b});
                for(var i in numeracion)
                    if(parseInt(i)+1 != numeracion[i])
                        return res.send({next: parseInt(i)+1, str: prefijo + (req.query.prefix ? '-' + req.query.prefix : '') + '-' + (parseInt(i)+1)});
                return res.send({next: numeracion.length+1, str: prefijo + (req.query.prefix? '-' + req.query.prefix : '') + '-' + (numeracion.length+1)});
            })
    });

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
            if(req.body.identificacion)
                conjunto.identificacion = req.body.identificacion;
            if(req.body.contexto)
                conjunto.contexto = req.body.contexto;
            if(req.body.contenidoOrganizacion)
                conjunto.contenidoOrganizacion = req.body.contenidoOrganizacion;
            if(req.body.condicionesAcceso)
                conjunto.condicionesAcceso = req.body.condicionesAcceso;
            if(req.body.documentacionAsociada)
                conjunto.documentacionAsociada = req.body.documentacionAsociada;
            if(req.body.publicaciones)
                conjunto.publicaciones = req.body.publicaciones;
            if(req.body.controlDescripcion)
                conjunto.controlDescripcion = req.body.controlDescripcion;

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
    });

module.exports = router; // Exponer el API para ser utilizado en server.js