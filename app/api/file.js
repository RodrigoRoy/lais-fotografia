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
let gm = require('gm');
var verifyToken = require('./token'); // Función de verificación de token

// Función a realizar siempre que se utilize esta API
router.use(function(req, res, next){
    // console.log('Usando el API Images.');
    // Rutas que son excluidas de verificación de token:
    if(req.method === 'GET')
        return next();
    // Antes de usar el API de usuario se verifica que haya token y sea válido
    verifyToken(req, res, next);
});

// En peticiones a la raiz del API
router.route('/')
	// Subir un archivo al servidor
	// Por default, emplea el directorio /public/files como temporal para guardar y después renombrar(mover) a la ubicación especificada (de forma relativa al directorio 'files')
	.post(function(req, res){
		// Asegurar que existe la ubicación /public/files
		fs.ensureDir(path.dirname(require.main.filename) + '/public/files', function(err){
			if(err)
				return res.send({success:false, message: 'Error el verificar/crear el directorio: ' + filePath, err: err});
			// Uso de formidable para recibir info. Se configuran opciones básicas:
			var form = new formidable.IncomingForm();
			form.uploadDir = path.dirname(require.main.filename) + '/public/files';
			form.keepExtensions = true;
			form.type = 'multipart';
			form.maxFieldsSize = 10 * 1024 * 1024; // 10MB
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
						if(files.file)
							// Renombrar la imagen para coincidir con su codigo de referencia
							fs.rename(files.file.path, absFilePath + fields.codigoReferencia + path.extname(files.file.name), function(err){
								if(err)
									return res.send({success:true, message: 'Archivo subido correctamente. \nAdvertencia: No se pudo renombrar el archivo', imagen: files.file.name});
								if(fields.path === '/imagenes') // Crear versiones de baja resolución para imagenes/fotografias
									fs.ensureDir(path.dirname(require.main.filename) + '/public/files/imagenes/resize', function(err){
										gm(absFilePath + fields.codigoReferencia + path.extname(files.file.name))
										.size(function(err, size){
											if(size.width > 200)
												gm(absFilePath + fields.codigoReferencia + path.extname(files.file.name))
												.quality(20)
												.resize(200)
												.write(path.dirname(require.main.filename) + '/public/files/imagenes/resize/' + fields.codigoReferencia + '_thumb.jpg', function(err){});
											else
												gm(absFilePath + fields.codigoReferencia + path.extname(files.file.name))
												.write(path.dirname(require.main.filename) + '/public/files/imagenes/resize/' + fields.codigoReferencia + '_thumb.jpg', function(err){});
											if(size.width > 480)
												gm(absFilePath + fields.codigoReferencia + path.extname(files.file.name))
												.quality(20)
												.resize(480)
												.write(path.dirname(require.main.filename) + '/public/files/imagenes/resize/' + fields.codigoReferencia + '_xs.jpg', function(err){});
											else
												gm(absFilePath + fields.codigoReferencia + path.extname(files.file.name))
												.write(path.dirname(require.main.filename) + '/public/files/imagenes/resize/' + fields.codigoReferencia + '_xs.jpg', function(err){});
											if(size.width > 960)
												gm(absFilePath + fields.codigoReferencia + path.extname(files.file.name))
												.quality(40)
												.resize(960)
												.write(path.dirname(require.main.filename) + '/public/files/imagenes/resize/' + fields.codigoReferencia + '_sm.jpg', function(err){});
											else
												gm(absFilePath + fields.codigoReferencia + path.extname(files.file.name))
												.write(path.dirname(require.main.filename) + '/public/files/imagenes/resize/' + fields.codigoReferencia + '_sm.jpg', function(err){});
											if(size.width > 1280)
												gm(absFilePath + fields.codigoReferencia + path.extname(files.file.name))
												.quality(60)
												.resize(1280)
												.write(path.dirname(require.main.filename) + '/public/files/imagenes/resize/' + fields.codigoReferencia + '_md.jpg', function(err){});
											else
												gm(absFilePath + fields.codigoReferencia + path.extname(files.file.name))
												.write(path.dirname(require.main.filename) + '/public/files/imagenes/resize/' + fields.codigoReferencia + '_md.jpg', function(err){});
											if(size.width > 1920)
												gm(absFilePath + fields.codigoReferencia + path.extname(files.file.name))
												.quality(80)
												.resize(1920)
												.write(path.dirname(require.main.filename) + '/public/files/imagenes/resize/' + fields.codigoReferencia + '_lg.jpg', function(err){});
											else
												gm(absFilePath + fields.codigoReferencia + path.extname(files.file.name))
												.write(path.dirname(require.main.filename) + '/public/files/imagenes/resize/' + fields.codigoReferencia + '_lg.jpg', function(err){});
										});
									});
								return res.send({success: true, message: 'Archivo original correctamente subido', imagen: fields.codigoReferencia + path.extname(files.file.name)});
							});
						else
							return res.send({success: false, message: 'El archivo enviado es vacio. Posiblemente se canceló la selección del archivo'});
					});
				}
				else{
					return res.send({success: false, message: 'No se indicó el directorio destino para el archivo'});
				}
			});
		});
		// return res.send({success:false, message: 'No se envió ningún archivo'}); // TODO: No hay manera de comprobar (asincronamente) si la información de la imagen es vacia para enviar este error
	});

// Borra un archivo en el sistema de archivos. Ejemplo:
// DELETE api/file/Carpeta ejemplo/Subcarpeta/archivo.jpg
// Borrará el archivo contenido en public/files/Carpeta ejemplo/Subcarpeta/archivo.jpg
router.route('/:folder*?/:filename')
	.delete(function(req, res){
		fs.access('public/files' + decodeURI(req.path), (fs.constants || fs).F_OK, function(err){
			if(err)
				return res.status(404).send({
					success: false,
					message: "File " + req.params.filename + " don't exist",
					path: decodeURI(req.path),
					err: err
				});
			fs.unlink('public/files' + decodeURI(req.path), function(err){
				if(err)
					return res.status(404).send({
						success: false,
						message: "Can't delete " + decodeURI(req.path),
						err: err
					});
				res.send({
					success: true, 
					message: 'Archivo ' + req.params.filename + ' borrado del servidor'
				});
			});
		});
	});

module.exports = router; // Exponer el API para ser utilizado en server.js