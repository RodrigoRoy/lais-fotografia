# Proyecto de catalogación de material fotográfico para la investigación social

El Laboratorio Audiovisual de Investigación Social (LAIS) del Instituto Mora ha diseñado una ficha de catalogación de material fotográfico para la investigación social y este proyecto es la propuesta de software libre que permite almacenar el material fotográfico digitalizado, documentarlo y organizarlo de manera eficiente y útil tanto para catalogadores, investigadores, usuarios que consultan la información o cualquier persona interesada.

Este proyecto nace como alternativa a software similar para catalogación fotográfica pero que presenta limitantes o carencias, tanto en software libre como propietario.


## Requisitos de instalación

- [NodeJS](https://nodejs.org) (version LTS preferentemente)
- [MongoDB](https://www.mongodb.org/) (Community Server)
- [GraphicsMagick](http://www.graphicsmagick.org/)
- [Git](https://git-scm.com/)

## Intrucciones de instalación

Desde terminal ejecutar:
```
git clone https://github.com/RodrigoRoy/lais-fotografia.git
cd lais-fotografia
npm install
npm start
```

## Instrucciones de uso

Abrir el navegador web (Firefox o Chrome, por ejemplo) y escribir la siguiente dirección:
```
http://localhost:8080
```

En caso de consultarlo desde un dispositivo externo (como smartphones y tables) que se encuentre conectado a la misma red local, entonces escribir la dirección de la IP del equipo, por ejemplo:
```
http://192.168.0.10:8080
```