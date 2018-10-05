# Proyecto de catalogación fotográfica para la investigación social

![Vista general del proyecto](https://media.giphy.com/media/25azClD47Y0ASjDakC/giphy.gif)

## Presentación

El **Laboratorio Audiovisual de Investigación Social (LAIS)** del Instituto Mora es un espacio colectivo e interdisciplinario dedicado a la investigación social con imágenes para incorporarlas como fuentes primarias, ya sea procedentes de archivo o generadas desde la misma investigación y como medio de divulgación de las investigaciones sociales. Como parte de este trabajo fomentamos el desarrollo de mecanismos de acceso libre al patrimonio imagético y de procesamiento de datos calográficos.

Este proyecto aplica la forma de catalogación desarrollada en el LAIS, basada en la norma ISAD(G), para facilitar la tarea de descripción, organización y puesta en acceso de material fotográfico.

### Objetivo principal

Dar a conocer a las personas interesadas en la investigación social con imágenes la metodología del LAIS para el trabajo con material fotográfico y poner a su disposición software que les permita describir, organizar y difundir dicho trabajo.

### Metas

- Creación de alternativa de software libre para la catalogación fotográfica para evitar complicaciones habituales con otros programas similares: pago por uso del programa, obsolescencia programada, poca (o nula) intención de uso para la investigación, incompatibilidad entre sistemas operativos, etc.
- Promover el uso de la metodología desarrollada en el LAIS para acompañar proyectos de investigación con el uso de fuentes audiovisuales.
- Promover la compartición de información y del código fuente del proyecto para obtener realimentación. De esta manera se puede mejorar el proyecto en favor de todos los interesados en el tema.

## Descripción general

El proyecto consiste en un sistema web que emplea la arquitectura cliente-servidor para realizar las tareas principales: administrar la información de catalogación y archivos de imagen, almacenar eficientemente en una base de datos y brindar mecanismos de autentificación y acceso de la información.

Estas son algunas de las características principales:

- Instalación en múltiples sistemas operativos: Windows, Mac y Linux.
- Uso desde cualquier navegador web: Chrome, Firefox, Opera, Safari, Edge.
- Descripción multinivel de la información que hace distinción entre conjuntos y unidades documentales/fotográficas.
- Incorporación de mapas para georeferenciar y visualizar ubicaciones.
- Sistema de usuarios para administrar la creación, edición y borrado de la información.
- Buscador de contenido con opción para buscar por similitud de palabra, exclusión o frase exacta.
- Creación de archivos de respaldo, útil para exportar e importar proyectos completos.
- Diseño responsivo basado en Material Design que permite cambiar el esquema de colores fácilmente.
- Diseñado para uso peronal o colectivo (preferentemente éste último) porque administra eficientemente múltiples usuarios a la vez.

## Escenarios de uso

El proyecto está pensado para ser instalado en un servidor y proveer el servicio a varios usuarios. Sin embargo, existen múltiples escenarios posibles para la instalación y uso del proyecto. Se enlistan algunos de estos casos:

### Uso personal

La persona que decide usar el proyecto emplea su computadora de escritorio o laptop, su mismo equipo funciona como servidor y cliente. Una vez realizada la instalación no requiere estar conectado en red para hacer uso del proyecto.

### Uso colectivo

Cuando se desea usar el proyecto en un espacio común, por ejemplo, una casa, un salón, un laboratorio, un edificio, una institución. Esto se logra al instalar el proyecto en una computadora o servidor conectado en red (no necesariamente a Internet). La infraestructura de red que proveen modems/routers permite usar el proyecto para otros usuarios sin necesidad de realizar instalación alguna.

### Uso desde Internet

También conocido como ambiente de producción,  es cuando se desea que el proyecto esté disponible en Internet en todo momento. El proyecto debe instalarse en un servidor o servicio web dedicado para tal efecto. Cualquier usuario conectado a Internet puede usar el proyecto.

## Instalación (servidor)

### Requisitos

Instalar los siguientes programas/apps/paquetes:

- [NodeJS](https://nodejs.org) (version LTS)
- [MongoDB](https://www.mongodb.org/) (Community Server)
- [GraphicsMagick](http://www.graphicsmagick.org/)
- [Git](https://git-scm.com/)

### Instrucciones

Abrir consola (Windows) o terminal (Mac, Linux) y ejecutar:

```bash
git clone https://github.com/RodrigoRoy/lais-fotografia.git
cd lais-fotografia
npm install
```

Al finalizar la instalación se solicitan algunos datos para configurar el proyecto:

1. **Nombre de la fototeca**. Es el nombre principal de la colección de conjuntos y unidades documentales/fotográficas.
2. **Prefijo del código de referencia**. Se recomienda usar un identificador breve que consigne el país y la institución a la que representa. Por ejemplo: México, Instituto Mora es representado como *MXIM*.
3. **Nombre de la base de datos**. Se recomienda un nombre igual o similar al de la fototeca. No será visible para los usuarios.
4. **Frase privada de seguridad**. Identifica de manera única y segura al proyecto para encriptar contraseñas e información sensible. No es neceario recordarla porque sólo se pide en esta ocasión.
5. **Puerto de red**. Se recomienda usar el puerto 8080 (default) y evitar usar el 8000 (puede provocar conflictos con otros proyectos web).

### Ejecutar proyecto

Inmediatamente después de realizar la instalación, ubicados en la carpeta/directorio del proyecto (`lais-fotografia`) ejecutar el siguiente comando desde consola o terminal:

```bash
npm install
```

## Utilización (cliente/usuario)

Abrir un navegador web (Chrome, Firefox, Opera, Safari, Edge) y escribir la siguiente dirección:
```
http://localhost:8080
```

Si se trabaja en un ambiente colectivo o con más de un dispositivo a la vez, entonces se debe escribir la dirección IP del equipo servidor (donde está instalado el proyecto), por ejemplo:
```
http://192.168.0.10:8080
```

## Colaboración

Si deseas ayudar al proyecto, la manera más fácil es [reportando problemas o solicitando funciones](https://github.com/RodrigoRoy/lais-fotografia/issues). También son bienvenidas las aportaciones al código realizando *[pull request](https://github.com/RodrigoRoy/lais-fotografia/pulls)* en la página del repositorio.

## Licencia

Este proyecto es software libre: puede ser redistribuido y/o modificado bajo los términos de **GNU General Public License v3.0** siempre y cuando se mantenga la misma licencia.

El proyecto es distribuido con el ánimo de ser útil para la comunidad, pero SIN NINGUNA GARANTÍA de uso. Se recomienda revisar los [téminos de licencia](https://github.com/RodrigoRoy/lais-fotografia/blob/master/LICENSE.md) para más detalles.