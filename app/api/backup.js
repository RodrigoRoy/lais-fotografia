'use strict';

/*
API para petición de copia de seguridad y restauración de toda la definición de la colección

Las rutas aqui definidas son un router que le antecede una ruta general de uso (ver server.js)
Por ejemplo:
GET    http://localhost:8080/api/backup/dump
POST   http://localhost:8080/api/backup/restore
*/

// Dependencias
const express = require('express');
const router = express.Router(); // para modularizar las rutas
const Usuario = require('../models/usuario'); // Modelo de la colección "Usuarios"
const verifyToken = require('./token'); // Función de verificación de token
const AdmZip = require('adm-zip'); // Creación y extracción de archivos zip
const fs = require('fs-extra'); // (Extra) File system utility
const { exec } = require('child_process'); // permite crear procesos en el sistema (ejecutar comandos en terminal)
const path = require('path'); // Useful to work with files and directories
const { db } = require('../../config');
// const db = config.db;
const rootDirectory = path.dirname(require.main.filename);

// // Función a realizar siempre que se utilize esta API
// router.use(function(req, res, next){
//     // Antes de usar el API de usuario se verifica que haya token y sea válido
//     verifyToken(req, res, next);
// });

// En peticiones para realizar copia de seguridad
router.route('/dump')
    .get(function(req, res){
        // Asegurar que existe el directorio para realizar la copia de seguridad
        fs.ensureDir(`${rootDirectory}/app/dataset`, function(err){
            if(err)
                return res.status(500).send({success: false, message: 'No es posible crear el directorio para la copia de seguridad', err: err});
            let dbname = /.*\/(.*)$/.exec(db)[1]; // extraer el nombre de la base de datos desde URL empleada para la conexión
            // Script para hacer dump de la base de datos MongoDB
            exec(`mongodump --db ${dbname} --out ${rootDirectory}/app/dataset/dump`, function(error, stdout, stderr){
                if(error){
                    fs.removeSync(`${rootDirectory}/app/dataset`);
                    return res.status(500).send({success: false, message: 'No fue posible realizar copia de seguridad de la base de datos', err: error});
                }
                try{
                    // Crear archivo zip con archivo de configuración, dump de base de datos y los archivos públicos (fotos/imagenes)
                    let zip = new AdmZip();
                    zip.addLocalFile(`${rootDirectory}/config.js`);
                    zip.addLocalFolder(`${rootDirectory}/app/dataset/dump`, 'dump');
                    zip.addLocalFolder(`${rootDirectory}/public/files`, 'files');
                    zip.writeZip(`${rootDirectory}/app/dataset/backup.zip`);
                }
                catch(error){
                    return res.status(500).send({success: false, message: 'No se pudo crear copia en formato zip', err: error});
                }
                // Eliminar archivos temporales, es decir, dump de la base de datos
                fs.remove(`${rootDirectory}/app/dataset/dump`, function(err){
                    if(err)
                        return res.send({success: true, message: `Copia de seguridad creada satisfactoriamente.\nADVERTENCIA: El directorio temporal 'app/dataset/dump' debe ser borrado manualmente`});
                    return res.send({success: true, message: `Copia de seguridad creada satisfactoriamente en 'app/dataset/'`});
                });
            });
        });
    });

// En peticiones para realizar recuperación desde una copia de seguridad
router.route('/restore')
    .post(function(req, res){
        // Asegurar que existe el archivo con la copia de seguridad
        fs.access(`${rootDirectory}/app/dataset/backup.zip`, (fs.constants || fs).F_OK, function(err){
            if(err)
                return res.status(500).send({success: false, message: `No existe el archivo 'backup.zip'`, err: err});
            try{
                // Verificar que se puede manipular archivos zip
                let zip = new AdmZip(`${rootDirectory}/app/dataset/backup.zip`);
                let zipEntries = zip.getEntries();
            }
            catch(error){
                return res.status(500).send({success: false, message: 'No fue posible obtener información del zip', err: error});
            }
            // Crear directorio temporal para descomprimir la copia de seguridad
            fs.ensureDir(`${rootDirectory}/app/dataset/tmp`, function(err){
                if(err)
                    return res.status(500).send({success: false, message: 'No se pudo crear el directorio temporal', err: err});
                try{
                    // Asegurar que se pueden extraer los archivos
                    zip.extractAllTo(`${rootDirectory}/app/dataset/tmp`, true);
                }
                catch(error){
                    return res.status(500).send({success: false, message: 'No se pudo extraer el archivo zip', err: error});
                }
                // Mover (y sobreescibir) el archivo de configuración
                fs.move(`${rootDirectory}/app/dataset/tmp/config.js`, `${rootDirectory}/`, {overwrite: true}, function(err){
                    if(err){
                        fs.removeSync(`${rootDirectory}/app/dataset/tmp`);
                        return res.status(500).send({success: false, message: 'No fue posible mover archivo de configuración', err: err});
                    }
                    // Mover (y sobreescribir) los archivos públicos (fotos/imágenes)
                    fs.move(`${rootDirectory}/app/dataset/tmp/files`, `${rootDirectory}/public`, {overwrite: true}, function(err){
                        if(err){
                            fs.removeSync(`${rootDirectory}/app/dataset/tmp`);
                            return res.status(500).send({success: false, message: 'No fue posible mover archivos públicos', err: err});
                        }
                        // TODO: Obtener nombre de la base de datos desde archivo zip
                        // Script para restaurar la base de datos MongoDB
                        exec(`mongorestore --db ${dbname} --drop ${rootDirectory}/app/dataset/tmp/dump/lais-fotografia`, function(error, stdout, stderr){
                            if(error){
                                fs.removeSync(`./app/dataset/tmp`);
                                return res.status(500).send({success: false, message: 'No se pudo restaurar la base de datos', err: error});
                            }
                            // Eliminar archivos temporales, es decir, directorio tmp donde se extrajeron los archivos
                            fs.removeSync(`${rootDirectory}/app/dataset/tmp`);
                            return res.send({success: true, message: 'Restauración de copia de seguridad completado exitósamente'});
                        });
                    });
                });
            });
        });
    });

module.exports = router; // Exportar el API para ser utilizado en server.js