# Proyecto de catalogación de material fotográfico para la investigación social

El Laboratorio Audiovisual de Investigación Social (LAIS) del Instituto Mora ha diseñado una ficha de catalogación de material fotográfico para la investigación social y este proyecto es la propuesta de software libre que permite almacenar el material fotográfico digitalizado, documentarlo y organizarlo de manera eficiente y útil tanto para catalogadores, investigadores, usuarios que consultan la información o cualquier persona interesada.

Este proyecto nace como alternativa a software similar para catalogación fotográfica pero que presenta limitantes o carencias, tanto en software libre como propietario.


## Requisitos de instalación

- Instalar el ambiente [NodeJS](https://nodejs.org) (version LTS)
- Instalar la base de datos [MongoDB](https://www.mongodb.org/) (Community Server)


## Intrucciones de instalación

**NOTA**: El proyecto aún se encuentra en desarrollo, se recomienda instalarlo como ambiente de prueba desde una computadora personal o laptop y evitar usarlo en ambiente de producción (servidor).

Abrir una terminal y descargar el proyecto usando git:
```
git clone https://github.com/RodrigoRoy/lais-fotografia
```
O descargar el proyecto en [ZIP](https://github.com/RodrigoRoy/lais-fotografia/archive/master.zip) y descomprimir

Dependiendo del sistema operativo ejecutar el script correspondiente:
* Linux: `install/linux/install.sh`
* macOS: `install/mac/install.command`
* Windows: `install\windows\install.bat`


## Instrucciones de uso

Dependiendo del sistema operativo ejecutar el script de inicio:
* Linux: `install/linux/start.sh`
* macOS: `install/mac/start.command`
* Windows: `install\windows\start.bat`

Abrir el navegador web (Firefox o Chrome, por ejemplo) y escribir la siguiente dirección:
```
http://localhost:8080
```

En caso de consultarlo desde un dispositivo externo (como smartphones y tables) que se encuentre conectado a la misma red local, entonces escribir la dirección de la IP del equipo, por ejemplo:
```
http://192.168.0.10:8080
```