'use strict';
/*
API para manejo de archivos

Las rutas aqui definidas son un router que le antecede una ruta general de uso (ver server.js)
Por ejemplo:
POST   http://localhost:8080/api/file
*/

// Dependencias
var express = require('express');
var router = express.Router(); // para modularizar las rutas
var fs = require('fs-extra'); // (Extra) File system utility
var formidable = require('formidable'); // To parse file uploads
var path = require('path'); // Useful to work with files and directories
var verifyToken = require('./token'); // Función de verificación de token

// Función a realizar siempre que se utilize esta API
// router.use(function(req, res, next){
//     // console.log('Usando el API Images.');
//     // Rutas que son excluidas de verificación de token:
//     if(req.method === 'GET')
//         return next();
//     // Antes de usar el API de usuario se verifica que haya token y sea válido
//     verifyToken(req, res, next);
// });

// En peticiones a la raiz del API
router.route('/')
	// Subir un archivo al servidor
	// Por default, emplea el directorio /public/files como temporal para guardar y después renombrar(mover) a la ubicación especificada (de forma relativa al directorio 'files')
	.post(function(req, res){
		// Uso de formidable para recibir info. Se configuran opciones básicas:
		var form = new formidable.IncomingForm();
		form.uploadDir = path.dirname(require.main.filename) + '/public/files';
		form.keepExtensions = true;
		form.type = 'multipart';
		form.maxFieldsSize = 2 * 1024 * 1024; // 2MB
		form.multiples = false;

		form.parse(req, function(err, fields, files){
			if(err)
				return res.send(err);
			if(fields.path){ // Verificar que exista el parámetro 'path' que indica el directorio donde se guardará el archivo
				let filePath = fields.path; // Se espera que file path esté escrito de forma relativa '/carpeta/subcarpeta/' (con diagonales al inicio y final)
				filePath = filePath.charAt(0) == '/' ? filePath : '/' + filePath; // Agregar '/' al inicio (en caso de no tener)
				filePath = filePath.charAt(filePath.length-1) == '/' ? filePath : filePath + '/'; // Agregar '/' al final (en caso de no tener)
				
				let absFilePath = path.dirname(require.main.filename) + '/public/files' + filePath; // Ubicación absoluta para guardar archivo
				fs.ensureDir(absFilePath, function(err){
					if(err)
						return res.send({success:false, message: 'Error el verificar/crear el directorio: ' + filePath, err: err});
					// Renombrar la imagen para coincidir con su codigo de referencia
					fs.rename(files.file.path, absFilePath + fields.codigoReferencia + path.extname(files.file.name), function(err){
						if(err)
							return res.send({success:true, message: 'Archivo subido correctamente. \nAdvertencia: No se pudo renombrar el archivo', imagen: files.file.name});
						return res.send({success: true, message: 'Archivo subido correctamente', imagen: fields.codigoReferencia + path.extname(files.file.name)});
					});
				});
			}
			else{
				return res.send({success: false, message: 'No se indicó el directorio destino para el archivo'});
			}
		});
		// return res.send({success:false, message: 'No se envió ningún archivo'}); // TODO: No hay manera de comprobar (asincronamente) si la información de la imagen es vacia para enviar este error
	})

module.exports = router; // Exponer el API para ser utilizado en server.js