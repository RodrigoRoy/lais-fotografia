'use strict';
/*
API para manejo de la base de datos con la colección de "ConjuntoDocumental"
Permite obtener datos en formato JSON mediante HTTP (GET, POST, PUT, DELETE)

Las rutas aqui definidas son un router que le antecede una ruta general de uso (ver server.js)
Por ejemplo:
GET    http://localhost:8080/api/conjuntoDocumental
GET    http://localhost:8080/api/conjuntoDocumental?code=1-2-3
POST   http://localhost:8080/api/conjuntoDocumental
GET    http://localhost:8080/api/conjuntoDocumental/prefix
GET    http://localhost:8080/api/conjuntoDocumental/tree
GET    http://localhost:8080/api/conjuntoDocumental/contains
GET    http://localhost:8080/api/conjuntoDocumental/isLeaf
GET    http://localhost:8080/api/conjuntoDocumental/next
GET    http://localhost:8080/api/conjuntoDocumental/1234567890
PUT    http://localhost:8080/api/conjuntoDocumental/1234567890
DELETE http://localhost:8080/api/conjuntoDocumental/1234567890
GET    http://localhost:8080/api/conjuntoDocumental/1234567890/suffix
*/

// Dependencias
var express = require('express');
var mongoose = require('mongoose');
var config = require('../../config');
var prefijo = config.prefix;
var nombre = config.name;
var router = express.Router(); // para modularizar las rutas
var ConjuntoDocumental = require('../models/conjuntoDocumental'); // Modelo de la colección "ConjuntoDocumental"
var UnidadDocumental = require('../models/unidadDocumental') // Modelo de la colleción "UnidadDocumental"
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
	// Obtener el _id y codigo de referencia de todos los conjuntos documentales
    // Si incluye el parámetro ?code, busca y selecciona un conjunto por código de referencia (sin incluir el prefijo de la colección)
	.get(function(req, res){
        if(Object.keys(req.query).length === 0){ // Si no hay parámetros del tipo ?param en URL
            ConjuntoDocumental.find().
            select({'identificacion.codigoReferencia': 1, 'identificacion.titulo': 1}).
            sort({'identificacion.codigoReferencia': 'asc'}).
            exec(function(err, conjuntos){
                if(err)
                    return res.send(err);
                return res.send(conjuntos);
            });
        }else{
            let codigo = req.query.code ? req.query.code : '';
            let regex = new RegExp('^' + prefijo + '-?' + codigo + '$');
            ConjuntoDocumental.findOne({'identificacion.codigoReferencia': regex}).
                lean().
                exec(function(err, conjunto){
                    if(err)
                        return res.send(err);
                    if(!conjunto)
                        return res.send({});
                    regex = new RegExp('^' + conjunto.identificacion.codigoReferencia);
                    UnidadDocumental.
                        find({'identificacion.codigoReferencia': regex}).
                        select({'identificacion.codigoReferencia': 1, 'identificacion.fecha': 1, 'estructuraContenido.lugarDescrito': 1, 'caracteristicasFisicas.tipo': 1}).
                        exec(function(err, unidades){
                            if(err)
                                return res.send(err);
                            // Agregar información adicional (inferida a partir de las unidades) al conjunto:
                            conjunto.identificacion.fecha = periodoTiempo(unidades);
                            conjunto.identificacion.cantidad = unidades.length;
                            conjunto.identificacion.lugar = listaLugares(unidades);
                            conjunto.identificacion.soporte = soportes(unidades);
                            return res.send(conjunto);
                        });
                });
        }
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
            return res.json({
                success: true,
                message: 'Se ha creado correctamente el conjunto documental "' + conjunto.identificacion.titulo + '"',
                data: conjunto
            });
        })
    });

// En peticiones específicas:

// Obtener el prefijo común a todos los conjuntos (por ejemplo: MXIM)
router.route('/prefix')
    .get(function(req, res){
        return res.send({prefijo: prefijo});
    });

// Obtener el nombre principal de todos los conjuntos documentales
router.route('/name')
    .get(function(req, res){
        return res.send({name: nombre});
    });

// Convierte el sufijo/numeración de un conjunto a su _id
// Requiere el parámetro ?c para indicar sufijo. Por ejemplo: ?c=3-2-1
router.route('/convertId')
    .get(function(req, res){
        if(!req.query.c)
            // return res.status(400).send({success: false, message: 'No se especifica la numeración del conjunto documental (?c=)'});
            return res.send(); // si no hay parámetro, devolver texto vacio
        let regex = new RegExp(`^${prefijo}-${req.query.c}$`);
        ConjuntoDocumental.find({'identificacion.codigoReferencia': regex}).
        exec(function(err, conjunto){
            if(err)
                return res.send(err);
            return res.send(conjunto[0]._id); // devolver únicamente string _id
        });
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
            return res.send(tree);
        });
    });

// Obtiene un arreglo de todos los subconjuntos contenido en un conjunto en particular.
// Se debe incluir el parámetro "prefix" para indicar la numeración del conjunto documental
// Por ejemplo: GET http://localhost:8080/api/conjuntoDocumental/contains?prefix=3-1
// El resultado es un objeto con la propiedad "subconjuntos" que es un arreglo de objetos:
// {"_id", "identificacion.codigoReferencia", "identificacion.titulo", "adicional.imagen"}
router.route('/contains')
    .get(function(req, res){
        let regex = req.query.prefix ? new RegExp('^' + prefijo + '-' + req.query.prefix + '-(\\d+)$') : new RegExp('^' + prefijo + '-(\\d+)$');
        ConjuntoDocumental.
            find({'identificacion.codigoReferencia': regex}).
            lean().
            select({'identificacion.codigoReferencia': 1, 'identificacion.titulo': 1, 'adicional.imagen': 1}).
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
                // Obtener las últimas 'portadas' para cada subconjunto (ya que la mayoría de conjuntos no tienen imagen propia):
                regex = req.query.prefix ? new RegExp('^' + prefijo + '-' + req.query.prefix) : new RegExp('^' + prefijo + '-.*');
                UnidadDocumental.
                    find({'identificacion.codigoReferencia': regex, 'adicional.imagen': {$exists: true}}).
                    select({'identificacion.codigoReferencia': 1, 'identificacion.fecha': 1, 'adicional.imagen': 1, 'updatedAt': 1}).
                    exec(function(err, unidades){
                        if(err)
                            return res.send(err);
                        // Agregar información adicional a los conjuntos:
                        subconjuntos.forEach(subconjunto => {
                            let unidadesFiltradas = filtrarUnidades(subconjunto.identificacion.codigoReferencia, unidades);
                            if(!subconjunto.adicional)
                                subconjunto.adicional = {imagen: ''}; // Evita referencias undefined al asignar 'adicional.imagen'
                            if(!subconjunto.adicional.imagen) // Solamente asignar a conjuntos sin imagen
                                subconjunto.adicional.imagen = ultimaImagen(unidadesFiltradas); // Código de referencia de última imagen actualizada
                            if(!subconjunto.identificacion.fecha)
                                subconjunto.identificacion.fecha = periodoTiempo(unidadesFiltradas);
                        });
                        return res.send(subconjuntos);
                    });
            });
    });

// Auxiliar para filtrar y reducir la cantidad de unidades de un conjunto específico.
// Recibe como parámetros el prefijo con el que se desea filtrar (por ejemplo, MXIM-1-2)
// y el conjunto (arreglo) de unidades.
// Devuelve un subconjunto (arreglo) de unidades cuyo código de referencia es prefijo del parámetro dado.
// Devuelve un arreglo vacio en caso de que haya unidades que cumplan con el criterio anterior.
var filtrarUnidades = function(prefix, unidades){
    let unidadesFiltradas = [];
    let regex = new RegExp('^' + prefix + '-.*');
    unidades.forEach(unidad => {
        if(regex.test(unidad.identificacion.codigoReferencia))
            unidadesFiltradas.push(unidad);
    });
    return unidadesFiltradas;
};

// Auxiliar para obtener la referencia (string) de la última imagen actualizada de un conjunto de unidades.
// Devuelve el código de referencia ('unidadDocumental.identificacion.codigoReferencia') de la imagen actualizada más recientemente,
// en caso de que el conjunto sea vacio, devuelve la cadena vacia.
var ultimaImagen = function(unidades){
    if(unidades.length === 0)
        return '';
    unidades.sort(function(a, b){
        return b.updatedAt.getTime() - a.updatedAt.getTime(); // ordenamiento cronológico
    });
    // Verificar que la última unidad actualizada realmente contenga una imagen, de lo contrario, revisar siguientes
    for(var i = 0; i < unidades.length; i++)
      if(unidades[i].adicional && unidades[i].adicional.imagen)
        return unidades[i].identificacion.codigoReferencia;
    return '';
};

// Determina el periodo de tiempo de un conjunto de unidades.
// Recibe como parámetro un conjunto de unidades documentales que pueden (o no) contener la propiedad fecha.
// y actualiza la fecha mínima (inicio) y máxima (fin) para cada unidad documental.
// Devuelve un objeto con las propiedades 'inicio' y 'fin' (tipo Date) para describir el periodo de tiempo.
// junto con la propiedad 'aproximada' (tipo Boolean) para indicar que incluye al menos una fecha aproximada.
// En caso de que la propiedad 'inicial' y 'fin' sean del mismo año, se omite la propiedad 'fin'.
// En caso de que el conjunto de unidades como parámetro sea vacio o no contenga fechas, se devuelve el valor undefined.
var periodoTiempo = function(unidades){
    if(unidades.length === 0)
        return undefined;
    let result = {inicio: undefined, fin: undefined, aproximada: false};
    unidades.forEach(unidad => {
        if(unidad.identificacion.fecha){
            if(unidad.identificacion.fecha.exacta){
                result.inicio = compareMinMax(result.inicio, unidad.identificacion.fecha.exacta, Math.min);
                result.fin = compareMinMax(result.fin, unidad.identificacion.fecha.exacta, Math.max);
            }
            else if(unidad.identificacion.fecha.periodo){
                if(unidad.identificacion.fecha.periodo.inicio){
                    result.inicio = compareMinMax(result.inicio, unidad.identificacion.fecha.periodo.inicio, Math.min);
                    result.fin = compareMinMax(result.fin, unidad.identificacion.fecha.periodo.inicio, Math.max);
                }
                if(unidad.identificacion.fecha.periodo.fin){
                    result.inicio = compareMinMax(result.inicio, unidad.identificacion.fecha.periodo.fin, Math.min);
                    result.fin = compareMinMax(result.fin, unidad.identificacion.fecha.periodo.fin, Math.max);
                }
            }
            else if(unidad.identificacion.fecha.aproximada){
                result.inicio = compareMinMax(result.inicio, unidad.identificacion.fecha.aproximada, Math.min);
                result.fin = compareMinMax(result.fin, unidad.identificacion.fecha.aproximada, Math.max);
                result.aproximada = true;
            }
        }
    });
    if(result.inicio && result.fin)
        if(result.inicio.getFullYear() === result.fin.getFullYear())
            result.fin = undefined;
    return result;
};
// Auxiliar para la función periodoTiempo.
// Compara dos fechas y devuelve la fecha mínima o máxima.
// Recibe como parámetro dos fechas y la función de comparación (Math.min ó Math.max)
// Devuelve la fecha mínima o máxima. En caso de que una de las fechas tenga el valor undefined, devuelve la única fecha
// y en caso de que ambas fechas sean undefined, el valor undefined es devuelto.
var compareMinMax = function(date1, date2, compareFunction){
    if(!date1 && !date2)
        return undefined;
    if(date1 && !date2)
        return date1;
    if(!date1 && date2)
        return date2;
    return new Date(compareFunction(date1.getTime(), date2.getTime()));
};

// Devuelve la lista de lugares de un conjunto de unidades.
// Recibe como parámetro un conjunto (arreglo) de unidades documentales
// Devuelve la lista sin repetición de lugares cuya estructura es la misma que unidadesDocumentales.estructuraContenido.lugarDescrito
// En caso de que la lista dada como parámetro o el resultado final sea vacia, se devuelve el valor undefined
var listaLugares = function(unidades){
    if(unidades.length === 0)
        return undefined;
    let allPlaces = [];
    unidades.forEach(unidad => {
        if(unidad.estructuraContenido.lugarDescrito && unidad.estructuraContenido.lugarDescrito.placeId && unidad.estructuraContenido.lugarDescrito.location){
            let repeticion = allPlaces.some(place => {
              return place.placeId == unidad.estructuraContenido.lugarDescrito.placeId;
            });
            if(!repeticion)
              allPlaces.push(unidad.estructuraContenido.lugarDescrito);
        }
    });
    if(allPlaces.length === 0)
        return undefined;
    return allPlaces;
};

// Devuelve la representación en cadena de texto de los diferentes tipo (soportes) que tiene un conjunto de unidades.
// Recibe como parámetro un conjunto (arreglo) de unidades documentales
// Devuelve un string con los diferentes tipos (soportes) que tiene el conjunto, sin repeticiones.
// En caso de que el conjunto dado como parámetro sea vacio o no tengan la propiedad caracteristicasFisicas.tipo, se devuelve el valor undefined
var soportes = function(unidades){
    if(unidades.length === 0)
        return undefined;
    let allTypes = [];
    unidades.forEach(unidad => {
        if(unidad.caracteristicasFisicas.tipo){
            let repeticion = allTypes.some(type => {
                return type == unidad.caracteristicasFisicas.tipo;
            });
            if(!repeticion)
                allTypes.push(unidad.caracteristicasFisicas.tipo);
        }
    });
    if(allTypes.length === 0)
        return undefined;
    return allTypes.join(', ');
};

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
        ConjuntoDocumental.findById(req.params.conjunto_id).
        lean().
        exec(function(err, conjunto){
            if(err)
                return res.send(err);
            var regex = new RegExp('^' + conjunto.identificacion.codigoReferencia + '-.*');
            UnidadDocumental.
                find({'identificacion.codigoReferencia': regex}).
                select({'identificacion.codigoReferencia': 1, 'identificacion.fecha': 1, 'estructuraContenido.lugarDescrito': 1, 'caracteristicasFisicas.tipo': 1}).
                exec(function(err, unidades){
                    if(err)
                        return res.send(err);
                    // Agregar información adicional (inferida a partir de las unidades) al conjunto:
                    conjunto.identificacion.fecha = periodoTiempo(unidades);
                    conjunto.identificacion.cantidad = unidades.length;
                    conjunto.identificacion.lugar = listaLugares(unidades);
                    conjunto.identificacion.soporte = soportes(unidades);
                    return res.send(conjunto);
                });
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
            if(req.body.adicional)
                conjunto.adicional = req.body.adicional;

            conjunto.save(function(err){
                if(err)
                    return res.send(err);
                return res.json({success: true, message: 'Se ha modificado la información del conjunto documental "' + conjunto.identificacion.titulo + '"'});
            });
        });
    })

    // Eliminar un conjunto documental en particular (mediante el ID)
    .delete(function(req, res){
        ConjuntoDocumental.remove({
            _id: req.params.conjunto_id
        }, function(err){
            if(err)
                return res.send(err);
            return res.json({success: true, message: 'Se ha borrado la información del conjunto documental'});
        });
    });

// En peticiones especiales para obtener sufijo
router.route('/:conjunto_id/suffix')
    // Obtener un conjunto documental particular (mediante el ID)
    .get(function(req, res){
        ConjuntoDocumental.findById(req.params.conjunto_id).
        select({'identificacion.codigoReferencia': 1}).
        exec(function(err, conjunto){
            if(err)
                return res.send(err);
            let regex = new RegExp('^' + prefijo + '-(.*)$');
            let result = regex.exec(conjunto.identificacion.codigoReferencia);
            return res.send({sufijo: result[1]});
        });
    });

// Devuelve un arreglo ordenado de conjuntos, que representan el orden en que están contenidos los conjuntos
// Ejemplo de respuesta:
// [{"_id": "5a62303f03e7563f969821c6",
//     "identificacion": ...,
//     "numeracion": "3"
// },{
//     "_id": "5a68c572e3bc2a0fac0a1da0",
//     "identificacion": ...,
//     "numeracion": "3-2"
// },{
//     "_id": "5a81b9f03e432e0ef74f1421",
//     "identificacion": ...,
//     "numeracion": "3-2-1"}]
router.route('/:conjunto_id/breadcrumb')
    .get(function(req, res){
        ConjuntoDocumental.findById(req.params.conjunto_id)
        .select({'identificacion.codigoReferencia': 1})
        .exec(function(err, conjuntoById){
            if(err)
                return res.send(err);
            let regex = new RegExp(`^${prefijo}-(.*)$`);
            let result = regex.exec(conjuntoById.identificacion.codigoReferencia); // obtener numeración, i.e. 3-2-1
            let numbers = result[1].split('-'); // [3, 2, 1]
            let conjuntosNumeracion = []; // numeraciones consecutivas
            for(let i in numbers){
                conjuntosNumeracion.push(conjuntosNumeracion.length === 0 ? `${numbers[i]}` : `${conjuntosNumeracion[conjuntosNumeracion.length-1]}-${numbers[i]}`);
            } // [3, 3-2, 3-2-1]
            let conjuntosId = []; // versiones con codigo de referencia completo (agregar prefijo)
            conjuntosNumeracion.forEach(function(numeracion){
                conjuntosId.push(`${prefijo}-${numeracion}`);
            }); // [MXIM-3, MXIM-3-2, MXIM-3-2-1] <-- para buscar en base de datos
            ConjuntoDocumental.find({'identificacion.codigoReferencia': {$in: conjuntosId}}).
            select({'identificacion.codigoReferencia': 1, 'identificacion.titulo': 1}).
            lean(). // para agregar propiedades adicionales, i.e. numeracion
            exec(function(err, conjuntos){
                if(err)
                    return res.send(err);
                conjuntos.forEach(function(conjunto){
                    conjunto.numeracion = regex.exec(conjunto.identificacion.codigoReferencia)[1];
                }); // agregar propiedad numeración, i.e. 3-2-1
                conjuntos.sort(function(a, b){ // ordenar los resultados de menor a mayor contención
                    return a.numeracion.length - b.numeracion.length || a.localeCompare(b);
                });
                return res.send(conjuntos);
            });
        });
    });

module.exports = router; // Exponer el API para ser utilizado en server.js
