'use strict';

const prompt = require('prompt'),
	fs = require('fs-extra');

fs.access('config.js' + decodeURI(req.path), (fs.constants || fs).F_OK, function(err){
	if(err)
		return console.log('No se reescribió el archivo de configuración porque ya existe');
	console.log('\n\nSe requieren algunos datos adicionales para completar la instalación:');
	let schema = {
		properties: {
			name: {
				description: 'Nombre de la fototeca',
				type: 'string',
				default: 'Fotografía e investigación',
				required: true
			},
			prefix: {
				description: 'Prefijo del código de referencia',
				type: 'string',
				pattern: /^[a-zA-Z0-9\-\_\.]{1,20}$/,
				message: 'Sólo se permiten letras, números, guión medio (-), guión bajo (_) y punto(.) con máxima longitud de 20 caracteres',
				default: 'MXIM',
				required: true
			},
			db: {
				description: 'Nombre para la base de datos',
				type: 'string',
				pattern: /^[a-zA-Z0-9\-]{1,30}$/,
				message: 'Sólo se permiten letras, números y guión medio (-) con máxima longitud de 30 caracteres',
				default: 'lais-fotografia',
				required: true,
				before: function(value) {return `mongodb://localhost:27017/${value}`}
			},
			jwt: {
				description: 'Frase privada de seguridad para encriptar',
				type: 'string',
				pattern: /^[a-zA-Z0-9]{10,}$/,
				message: 'Sólo se permiten letras y números sin espacio con una longitud mínima de 10 caracteres',
				required: true
			},
			port: {
				description: 'Puerto de red',
				type: 'integer',
				pattern: /^\d+$/,
				message: 'El puerto de red debe ser un número entero. Preferentemente que no sea un puerto ocupado por algún protocolo',
				default: 8080,
				required: true
			}
		}
	};
	prompt.start();
	prompt.get(schema, function(err, result){
		if(err)
			return console.log('Error al iniciar prompt para obtener valores de configuración: ', err);
		let data = `module.exports = {
		port: ${result.port}, // Puerto del servidor
		db: '${result.db}', // Dirección de la base de datos
		jwt: '${result.jwt}',
		prefix: '${result.prefix}', // Prefijo para el código de referencia
		name: '${result.name}' // Nombre de la fototeca
	}`;
		fs.writeFile('config.js', data, function(err){
			if(err)
				return console.log('Error al guardar en archivo config.js: ', err);
			console.log('Archivo de configuración (config.js) creado');

			fs.ensureDir('public/files', function(err){
				if(err)
					return console.log('Error en creación del directorio "public/files":', err);
				console.log('\nInstalación completa');
			});
		});
	});
});
