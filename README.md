# Proyecto de catalogación de material fotográfico para la investigación social

El Laboratorio Audiovisual de Investigación Social (LAIS) del Instituto Mora ha diseñado una ficha de catalogación de material fotográfico para la investigación social y este proyecto es la propuesta de software libre que permite almacenar el material fotográfico digitalizado, documentarlo y organizarlo de manera eficiente y útil tanto para catalogadores, investigadores, usuarios que consultan la información o cualquier persona interesada.

Este proyecto nace como alternativa a software similar para catalogación fotográfica pero que presenta limitantes o carencias, tanto en software libre como propietario.


## Requisitos de instalación

- Sistema operativo Windows, Mac o Linux
- Instalar el ambiente [NodeJS](https://nodejs.org) (version LTS)
- Instalar la base de datos [MongoDB](https://www.mongodb.org/) (Community Server)
- Instalar [Git](https://git-scm.com/)
- Instalar Bower usando el manejador de paquetes de Node.js (NPM):
`npm install -g bower`


## Intrucciones de instalación

**NOTA**: El proyecto aún se encuentra en desarrollo, se recomienda instalarlo como ambiente de prueba desde una computadora personal o laptop y evitar usarlo en ambiente de producción por las actualizaciones constantes.

Abrir una terminal y descargar el proyecto usando git:
```
git clone https://github.com/RodrigoRoy/lais-fotografia
```

Dentro de la carpeta del proyecto nombrada *lais-fotografia*, crear el archivo de configuración **config.js**:
```javascript
module.exports = {
	port: 8080, // Puerto del servidor
	db: 'mongodb://localhost:27017/database-name', // Dirección de la base de datos
	prefix: 'MXIM', // Prefijo para el código de referencia
	name: 'Fototecas Digitales' // Nombre de la fototeca
}
```

Crear el directorio *files* dentro de la ubicación *public/*.

Ubicarse en el directorio del proyecto (lais-fotografia) e instalar las dependencias del servidor (back-end):
```
npm install
```

Instalar las dependencias del navegador web (front-end):
```
bower install
```

Ejecutar el proyecto con node:
```
node server.js
```

Estando ubicado en la carpeta del proyecto, ejecutar en terminal:
```
npm install
bower install
node server.js
```

Abrir el navegador web (Firefox o Chrome, por ejemplo) y escribir la siguiente dirección:
```
http://localhost:8080
```

En caso de consultarlo desde un dispositivo externo (como smartphones y tables) que se encuentre conectado a la misma red local, entonces escribir la dirección de la IP del equipo, por ejemplo:
```
http://192.168.0.10:8080
```