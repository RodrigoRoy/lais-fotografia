/*
API para manejo de archivos

Las rutas aqui definidas son un router que le antecede una ruta general de uso (ver server.js)
Por ejemplo:
POST   http://localhost:8080/api/file
*/

// Dependencias
var express = require('express');
var router = express.Router(); // para modularizar las rutas
var fs = require('fs'); // File system utility
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
	// Subir una imagen al servidor
	.post(function(req, res){
		// Uso de formidable para recibir info. Se configuran opciones básicas:
		var form = new formidable.IncomingForm();
		form.uploadDir = path.dirname(require.main.filename) + '/files/unidades';
		form.keepExtensions = true;
		form.type = 'multipart';
		form.maxFieldsSize = 2 * 1024 * 1024; // 2MB
		form.multiples = false;

		form.parse(req, function(err, fields, files){
			if(err)
				return res.send(err);
			// Renombrar la imagen para coincidir con su codigo de referencia
			fs.rename(files.file.path, path.dirname(require.main.filename) + '/files/unidades/' + fields.codigoReferencia + path.extname(files.file.name), function(err){
				if(err)
					return res.send({success:true, message: 'Archivo subido correctamente. \nAdvertencia: No se pudo renombrar el archivo', imagen: files.file.name});
				return res.send({success: true, message: 'Archivo subido correctamente', imagen: fields.codigoReferencia + path.extname(files.file.name)});
			});
		});
		// return res.send({success:false, message: 'No se envió ningún archivo'}); // TODO: No hay manera de comprobar (asincronamente) si la información de la imagen es vacia para enviar este error
	})

module.exports = router; // Exponer el API para ser utilizado en server.js