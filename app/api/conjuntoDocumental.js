'use strict';
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
var UnidadDocumental = require('../models/unidadDocumental') // Modelo de la colleción "UnidadDocumental"
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
	// Obtener el _id y codigo de referencia de todos los conjuntos documentales
	.get(function(req, res){

        ConjuntoDocumental.find().
        select({'identificacion.codigoReferencia': 1, 'identificacion.titulo': 1}).
        sort({'identificacion.codigoReferencia': 'asc'}).
        exec(function(err, conjuntos){
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

// Auxiliar para filtrar una lista de conjuntos y devolver solamente sus subconjuntos.
// El primer parámetro es la lista de conjuntos y el segundo parámetro es el prefijo con el que se desea filtrar
// Devuelve la lista ordenada de conjuntos con el mismo prefijo dado como parámetro, en caso de no haber, devuelve una lista vacia
var filterByPrefix = function(listaConjuntos, prefix){
    var subconjuntos = [];
    var regex = new RegExp('^' + prefix + '-(\\d+)$');
    listaConjuntos.forEach(conjunto => {
        if(regex.test(conjunto.identificacion.codigoReferencia))
            subconjuntos.push(conjunto);
    });
    subconjuntos.sort(function(a,b){
        var first = parseInt(/(\d+)$/.exec(a.identificacion.codigoReferencia)[1]),
            second = parseInt(/(\d+)$/.exec(b.identificacion.codigoReferencia)[1]);
        return first-second;
    });
    return subconjuntos;
};

// Construye la lista que contiene los conjuntos y sus respectivos subconjuntos en orden numérico
// Se espera que su uso inicial sea: recursiveTree(todosConjuntos, 'MXIM');
var recursiveTree = function(listaConjuntos, prefix){
    var tree = [];
    tree = filterByPrefix(listaConjuntos, prefix);
    if(tree.length === 0)
        return tree;
    for(var i in tree)
        tree[i].subconjuntos = recursiveTree(listaConjuntos, tree[i].identificacion.codigoReferencia);
    return tree;
};

// Obtiene una estructura de árbol embebida en un objeto json para representar la estructura de los conjuntos documentales
router.route('/tree')
    .get(function(req, res){
        ConjuntoDocumental.find().
        lean().
        select({'identificacion.codigoReferencia': 1, 'identificacion.titulo': 1}).
        exec(function(err, conjuntos){
            if(err)
                return res.send(err);
            let tree = [],
                conjuntosSuffix = conjuntos,
                regex = new RegExp('^' + prefijo + '-(.*)$');
            // Agregar sufijo en cada conjunto (útil en la navegación del sitio)
            for(let i in conjuntosSuffix)
                conjuntosSuffix[i].sufijo = regex.exec(conjuntosSuffix[i].identificacion.codigoReferencia)[1];
            tree = recursiveTree(conjuntos, prefijo);
            res.send(tree);
        });        
    });

// Obtiene un arreglo de todos los subconjuntos contenido en un conjunto en particular.
// Se debe incluir el parámetro "prefix" para indicar la numeración del conjunto documental
// Por ejemplo: GET http://localhost:8080/api/conjuntoDocumental/contains?prefix=3-1
// El resultado es un objeto con la propiedad "subconjuntos" que es un arreglo de objetos: {"_id", "codigoReferencia"}
router.route('/contains')
    .get(function(req, res){
        let regex = req.query.prefix ? new RegExp('^' + prefijo + '-' + req.query.prefix + '-(\\d+)$') : new RegExp('^' + prefijo + '-(\\d+)$');
        ConjuntoDocumental.
            find({'identificacion.codigoReferencia': regex}).
            select({'identificacion.codigoReferencia': 1, 'identificacion.titulo': 1}).
            exec(function(err, conjuntos){
                if(err)
                    return res.send(err);
                let subconjuntos = [];
                conjuntos.forEach(conjunto => {
                    subconjuntos.push(conjunto);
                });
                subconjuntos.sort(function(a,b){
                    let first = parseInt(/(\d+)$/.exec(a.identificacion.codigoReferencia)[1]),
                        second = parseInt(/(\d+)$/.exec(b.identificacion.codigoReferencia)[1]);
                    return first-second;
                });
                res.send(subconjuntos);
            });
    });

// Determina si un conjunto es una "hoja" en la jerarquia de todos los conjuntos y subconjuntos.
// Un conjunto se considera hoja o nodo terminal si no contiene más subconjuntos o si además de ser vacio, no contiene unidades documentales en él.
// En otro caso, no se le considera hoja.
router.route('/isLeaf')
    .get(function(req, res){
        let regex = new RegExp('^' + prefijo + '-' + req.query.prefix + '-\\d+$');
        ConjuntoDocumental.
            find({'identificacion.codigoReferencia': regex}).
            select({'identificacion.codigoReferencia': 1, '_id': -1}).
            exec(function(err, conjuntos){
                if(err)
                    return res.send(err);
                if(conjuntos && conjuntos.length > 0){
                    return res.send(false);
                }
                else{
                    UnidadDocumental.
                        find({'identificacion.codigoReferencia': regex}).
                        select({'identificacion.codigoReferencia': 1, '_id': -1}).
                        exec(function(err, unidades){
                            if(err)
                                return res.send(err);
                            if(unidades && unidades.length > 0)
                                return res.send(true);
                            else
                                return res.send(false);
                        });
                }
            });
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
            if(req.body.estructuraContenido)
                conjunto.estructuraContenido = req.body.estructuraContenido;
            if(req.body.condicionesAcceso)
                conjunto.condicionesAcceso = req.body.condicionesAcceso;
            if(req.body.documentacionAsociada)
                conjunto.documentacionAsociada = req.body.documentacionAsociada;
            if(req.body.publicaciones)
                conjunto.publicaciones = req.body.publicaciones;
            if(req.body.notas)
                conjunto.notas = req.body.notas;
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