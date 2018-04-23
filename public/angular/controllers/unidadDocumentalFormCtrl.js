// Controlador del formulario para un Conjunto Documental

angular.module('UnidadDocumentalFormCtrl',[]).controller('UnidadDocumentalFormController', function ($scope, $timeout, $q, $location, $routeParams, $route, UnidadDocumental, ConjuntoDocumental, File, NgMap, NavigatorGeolocation, GeoCoder){
	
    // Objeto que representa toda la información de la unidad documental, como se describe en el modelo unidadDocumental.
    // Se pueden inicializar algunos valores por default.
    $scope.unidadDocumental = {
    	identificacion: {
    		//conjuntoPertenencia: "Conjunto 'padre'", // Referencia al conjunto padre
    		autores: [{
    			tipo: '',
    			nombre: ''
    		}]
    	},
		estructuraContenido: {},
        caracteristicasFisicas: {
            soportePrimario: {
                inscripciones: [{
                    transcripcion: '',
                    ubicacion: ''
                }]
            },
            soporteSecundario: {
                inscripciones: [{
                    transcripcion: '',
                    ubicacion: ''
                }]
            },
            sellos: [{
                transcripcion: '',
                ubicacion: ''
            }]
        },
		documentacionAsociada: {},
		publicaciones: {},
		controlDescripcion: {
			//documentalistas: [],
		},
        adicional: {
            isPublic: true,
        }
    };
    $scope.auxiliar = {
        publicaciones: [{text: ''}],
        exposicion: [{text: ''}],
        fotografiaMismoNegativo: [{text: ''}],
        fotografiaBase: [{text: ''}],
        reprografia: [{text: ''}],
        fotografiaMismaSecuencia: [{text: ''}],
        fotografiaConsecutiva: [{text: ''}],
        fotografiaConsecutivaOtraCamara: [{text: ''}],
        fotografiaEncuadreSimilar: [{text: ''}],
        grabadoRelacionado: [{text: ''}]
    };
    $scope.edit = false; // Bandera para indicar si se está editando o creando un nuevo registro
    $scope.isGoogleDefined = google ? true : false; // Determina si la variable google fue inicializada mediante llamada <script> en index

    // Agrega un "nuevo" autor.
    // Recibe como parámetro el nombre escrito previamente como autor, si no es vacio, agrega un autor vacio (i.e. un nuevo input en blanco).
    $scope.agregarAutor = function(nombre){
        var lastAutor = $scope.unidadDocumental.identificacion.autores[$scope.unidadDocumental.identificacion.autores.length - 1];
        if(nombre)
            if($scope.unidadDocumental.identificacion.autores.length == 1 || lastAutor.nombre != '') // se agrega autor vacio cuando es el primer autor agregado o cuando el último no es vacio
              $scope.unidadDocumental.identificacion.autores.push({tipo: '', nombre: ''});
    };
    // Agrega una "nueva" inscripción de manera análoga a la función "agregarAutor"
    $scope.agregaInscripcionPrimario = function(transcripcion){
        var lastInscripcion = $scope.unidadDocumental.caracteristicasFisicas.soportePrimario.inscripciones[$scope.unidadDocumental.caracteristicasFisicas.soportePrimario.inscripciones.length - 1];
        if(transcripcion)
            if($scope.unidadDocumental.caracteristicasFisicas.soportePrimario.inscripciones.length == 1 || lastInscripcion.transcripcion != '')
                $scope.unidadDocumental.caracteristicasFisicas.soportePrimario.inscripciones.push({transcripcion: '', ubicacion: ''});
    };
    $scope.agregaInscripcionSecundario = function(transcripcion){
        var lastInscripcion = $scope.unidadDocumental.caracteristicasFisicas.soporteSecundario.inscripciones[$scope.unidadDocumental.caracteristicasFisicas.soporteSecundario.inscripciones.length - 1];
        if(transcripcion)
            if($scope.unidadDocumental.caracteristicasFisicas.soporteSecundario.inscripciones.length == 1 || lastInscripcion.transcripcion != '')
                $scope.unidadDocumental.caracteristicasFisicas.soporteSecundario.inscripciones.push({transcripcion: '', ubicacion: ''});
    };
    // Agrega un "nuevo" sello de manera análoga a la función "agregaAutor"
    $scope.agregarSello = function(transcripcion){
        var lastValue = $scope.unidadDocumental.caracteristicasFisicas.sellos[$scope.unidadDocumental.caracteristicasFisicas.sellos.length-1];
        if(transcripcion)
            if($scope.unidadDocumental.caracteristicasFisicas.sellos.length == 1 || lastValue.transcripcion != '')
                $scope.unidadDocumental.caracteristicasFisicas.sellos.push({transcripcion: '', ubicacion: ''});
    }
    // Agregar un "nuevo" valor de manera análoga a la función "agregaAutor" empleando $scope.auxiliar
    // La misma estrategia es utilizada para aquellas propiedades que representan arreglos de texto como:
    // publicacion, exposicion, todas las propiedades del area de documentacion Asociada.
    $scope.agregarPublicacion = function(newText){
        var lastValue = $scope.auxiliar.publicaciones[$scope.auxiliar.publicaciones.length-1];
        if(newText.trim() != '')
            if($scope.auxiliar.publicaciones.length == 1 || lastValue.text != '')
                $scope.auxiliar.publicaciones.push({text: ''});
    };
    $scope.agregarExposicion = function(newText){
        var lastValue = $scope.auxiliar.exposicion[$scope.auxiliar.exposicion.length-1];
        if(newText.trim() != '')
            if($scope.auxiliar.exposicion.length == 1 || lastValue.text != '')
                $scope.auxiliar.exposicion.push({text: ''});
    };
    $scope.agregarFotografiaMismoNegativo = function(newText){
        var lastValue = $scope.auxiliar.fotografiaMismoNegativo[$scope.auxiliar.fotografiaMismoNegativo.length-1];
        if(newText.trim() != '')
            if($scope.auxiliar.fotografiaMismoNegativo.length == 1 || lastValue.text != '')
                $scope.auxiliar.fotografiaMismoNegativo.push({text: ''});
    };
    $scope.agregarFotografiaBase = function(newText){
        var lastValue = $scope.auxiliar.fotografiaBase[$scope.auxiliar.fotografiaBase.length-1];
        if(newText.trim() != '')
            if($scope.auxiliar.fotografiaBase.length == 1 || lastValue.text != '')
                $scope.auxiliar.fotografiaBase.push({text: ''});
    };
    $scope.agregarReprografia = function(newText){
        var lastValue = $scope.auxiliar.reprografia[$scope.auxiliar.reprografia.length-1];
        if(newText.trim() != '')
            if($scope.auxiliar.reprografia.length == 1 || lastValue.text != '')
                $scope.auxiliar.reprografia.push({text: ''});
    };
    $scope.agregarFotografiaMismaSecuencia = function(newText){
        var lastValue = $scope.auxiliar.fotografiaMismaSecuencia[$scope.auxiliar.fotografiaMismaSecuencia.length-1];
        if(newText.trim() != '')
            if($scope.auxiliar.fotografiaMismaSecuencia.length == 1 || lastValue.text != '')
                $scope.auxiliar.fotografiaMismaSecuencia.push({text: ''});
    };
    $scope.agregarFotografiaConsecutiva = function(newText){
        var lastValue = $scope.auxiliar.fotografiaConsecutiva[$scope.auxiliar.fotografiaConsecutiva.length-1];
        if(newText.trim() != '')
            if($scope.auxiliar.fotografiaConsecutiva.length == 1 || lastValue.text != '')
                $scope.auxiliar.fotografiaConsecutiva.push({text: ''});
    };
    $scope.agregarFotografiaConsecutivaOtraCamara = function(newText){
        var lastValue = $scope.auxiliar.fotografiaConsecutivaOtraCamara[$scope.auxiliar.fotografiaConsecutivaOtraCamara.length-1];
        if(newText.trim() != '')
            if($scope.auxiliar.fotografiaConsecutivaOtraCamara.length == 1 || lastValue.text != '')
                $scope.auxiliar.fotografiaConsecutivaOtraCamara.push({text: ''});
    };
    $scope.agregarFotografiaEncuadreSimilar = function(newText){
        var lastValue = $scope.auxiliar.fotografiaEncuadreSimilar[$scope.auxiliar.fotografiaEncuadreSimilar.length-1];
        if(newText.trim() != '')
            if($scope.auxiliar.fotografiaEncuadreSimilar.length == 1 || lastValue.text != '')
                $scope.auxiliar.fotografiaEncuadreSimilar.push({text: ''});
    };
    $scope.agregarGrabadoRelacionado = function(newText){
        var lastValue = $scope.auxiliar.grabadoRelacionado[$scope.auxiliar.grabadoRelacionado.length-1];
        if(newText.trim() != '')
            if($scope.auxiliar.grabadoRelacionado.length == 1 || lastValue.text != '')
                $scope.auxiliar.grabadoRelacionado.push({text: ''});
    };

    // Google Maps (NgMap)
    // Actualiza el marcador del mapa para asignar y centrar la ubicación elegida en el input "places-auto-complete"
    $scope.placeChanged = function(){
        let place = this.getPlace();
        if(place) // Si es un lugar válido con ubicación LatLng
            NgMap.getMap().then(function(map){
                $scope.unidadDocumental.estructuraContenido.lugarDescrito = {};
                $scope.unidadDocumental.estructuraContenido.lugarDescrito.placeId = place.place_id;
                $scope.unidadDocumental.estructuraContenido.lugarDescrito.location = {lat: place.geometry.location.lat(), lng: place.geometry.location.lng()};
                $scope.unidadDocumental.estructuraContenido.lugarDescrito.formattedAddress = place.formatted_address;
                map.setCenter(place.geometry.location);
            });
        else
            $scope.unidadDocumental.estructuraContenido.lugarDescrito = undefined;
    };
    // Actualizar marcador y referencias después de haber sido movido el marcador dentro del mapa
    $scope.getPosition = function(event){
        $scope.unidadDocumental.estructuraContenido.lugarDescrito.location = {lat: event.latLng.lat(), lng: event.latLng.lng()};
        NgMap.getMap().then(function(map){
            GeoCoder.geocode({location: event.latLng}).then(function(res){
                if(res && res.length > 0){
                    map.setCenter(event.latLng);
                    $scope.unidadDocumental.estructuraContenido.lugarDescrito.placeId = res[0].place_id;
                    $scope.unidadDocumental.estructuraContenido.lugarDescrito.formattedAddress = res[0].formatted_address;
                }
            });
        });
    };
    // Elimina el marcador del mapa y las referencias asociadas. Util cuando no se puede corroborar el lugar descrito
    $scope.borrarLugar = function(){
        $scope.unidadDocumental.estructuraContenido.lugarDescrito = undefined;
    };

    // Realiza los cambios necesarios en el objeto $scope.unidadDocumental para que sea aceptado por el modelo de la base de datos
    var cleanUnidadDocumentalData = function(){
        // Limpia nombres (y tipos) de autores vacios
        for(var i = $scope.unidadDocumental.identificacion.autores.length - 1; i >= 0; i--)
            if(!$scope.unidadDocumental.identificacion.autores[i].nombre || !$scope.unidadDocumental.identificacion.autores[i].tipo)
                $scope.unidadDocumental.identificacion.autores.splice(i, 1);
        // Limpia transcripciones (y ubicaciones) de inscripciones vacias (en soporte primario)
        for(var i = $scope.unidadDocumental.caracteristicasFisicas.soportePrimario.inscripciones.length - 1; i >= 0; i--)
            if(!$scope.unidadDocumental.caracteristicasFisicas.soportePrimario.inscripciones[i].transcripcion)
                $scope.unidadDocumental.caracteristicasFisicas.soportePrimario.inscripciones.splice(i, 1);
        // Limpia transcripciones (y ubicaciones) de inscripciones vacias (en soporte secundario)
        for(var i = $scope.unidadDocumental.caracteristicasFisicas.soporteSecundario.inscripciones.length - 1; i >= 0; i--)
            if(!$scope.unidadDocumental.caracteristicasFisicas.soporteSecundario.inscripciones[i].transcripcion)
                $scope.unidadDocumental.caracteristicasFisicas.soporteSecundario.inscripciones.splice(i, 1);
        // Limpia sellos vacios
        for(var i = $scope.unidadDocumental.caracteristicasFisicas.sellos.length - 1; i >= 0; i--)
            if(!$scope.unidadDocumental.caracteristicasFisicas.sellos[i].transcripcion)
                $scope.unidadDocumental.caracteristicasFisicas.sellos.splice(i, 1);
        // Copiar valores en $scope.auxiliar a $scope.unidadDocumental.
        // La misma idea se aplica análogamente para varias propiedades.
        // publicaciones
        $scope.unidadDocumental.publicaciones.publicacion = [];
        $scope.auxiliar.publicaciones.forEach(value => {
            if(value.text != '')
                $scope.unidadDocumental.publicaciones.publicacion.push(value.text);
        });
        $scope.unidadDocumental.publicaciones.publicacion = $scope.unidadDocumental.publicaciones.publicacion.length > 0 ? $scope.unidadDocumental.publicaciones.publicacion : undefined;
        // exposicion
        $scope.unidadDocumental.publicaciones.exposicion = [];
        $scope.auxiliar.exposicion.forEach(value => {
            if(value.text != '')
                $scope.unidadDocumental.publicaciones.exposicion.push(value.text);
        });
        $scope.unidadDocumental.publicaciones.exposicion = $scope.unidadDocumental.publicaciones.exposicion.length > 0 ? $scope.unidadDocumental.publicaciones.exposicion : undefined;
        // fotografiaMismoNegativo
        $scope.unidadDocumental.documentacionAsociada.fotografiaMismoNegativo = [];
        $scope.auxiliar.fotografiaMismoNegativo.forEach(value => {
            if(value.text != '')
                $scope.unidadDocumental.documentacionAsociada.fotografiaMismoNegativo.push(value.text);
        });
        $scope.unidadDocumental.documentacionAsociada.fotografiaMismoNegativo = $scope.unidadDocumental.documentacionAsociada.fotografiaMismoNegativo.length > 0 ? $scope.unidadDocumental.documentacionAsociada.fotografiaMismoNegativo : undefined;
        // fotografiaBase
        $scope.unidadDocumental.documentacionAsociada.fotografiaBase = [];
        $scope.auxiliar.fotografiaBase.forEach(value => {
            if(value.text != '')
                $scope.unidadDocumental.documentacionAsociada.fotografiaBase.push(value.text);
        });
        $scope.unidadDocumental.documentacionAsociada.fotografiaBase = $scope.unidadDocumental.documentacionAsociada.fotografiaBase.length > 0 ? $scope.unidadDocumental.documentacionAsociada.fotografiaBase : undefined;
        // reprografia
        $scope.unidadDocumental.documentacionAsociada.reprografia = [];
        $scope.auxiliar.reprografia.forEach(value => {
            if(value.text != '')
                $scope.unidadDocumental.documentacionAsociada.reprografia.push(value.text);
        });
        $scope.unidadDocumental.documentacionAsociada.reprografia = $scope.unidadDocumental.documentacionAsociada.reprografia.length > 0 ? $scope.unidadDocumental.documentacionAsociada.reprografia : undefined;
        // fotografiaMismaSecuencia
        $scope.unidadDocumental.documentacionAsociada.fotografiaMismaSecuencia = [];
        $scope.auxiliar.fotografiaMismaSecuencia.forEach(value => {
            if(value.text != '')
                $scope.unidadDocumental.documentacionAsociada.fotografiaMismaSecuencia.push(value.text);
        });
        $scope.unidadDocumental.documentacionAsociada.fotografiaMismaSecuencia = $scope.unidadDocumental.documentacionAsociada.fotografiaMismaSecuencia.length > 0 ? $scope.unidadDocumental.documentacionAsociada.fotografiaMismaSecuencia : undefined;
        // fotografiaConsecutiva
        $scope.unidadDocumental.documentacionAsociada.fotografiaConsecutiva = [];
        $scope.auxiliar.fotografiaConsecutiva.forEach(value => {
            if(value.text != '')
                $scope.unidadDocumental.documentacionAsociada.fotografiaConsecutiva.push(value.text);
        });
        $scope.unidadDocumental.documentacionAsociada.fotografiaConsecutiva = $scope.unidadDocumental.documentacionAsociada.fotografiaConsecutiva.length > 0 ? $scope.unidadDocumental.documentacionAsociada.fotografiaConsecutiva : undefined;
        // fotografiaConsecutivaOtraCamara
        $scope.unidadDocumental.documentacionAsociada.fotografiaConsecutivaOtraCamara = [];
        $scope.auxiliar.fotografiaConsecutivaOtraCamara.forEach(value => {
            if(value.text != '')
                $scope.unidadDocumental.documentacionAsociada.fotografiaConsecutivaOtraCamara.push(value.text);
        });
        $scope.unidadDocumental.documentacionAsociada.fotografiaConsecutivaOtraCamara = $scope.unidadDocumental.documentacionAsociada.fotografiaConsecutivaOtraCamara.length > 0 ? $scope.unidadDocumental.documentacionAsociada.fotografiaConsecutivaOtraCamara : undefined;
        // fotografiaEncuadreSimilar
        $scope.unidadDocumental.documentacionAsociada.fotografiaEncuadreSimilar = [];
        $scope.auxiliar.fotografiaEncuadreSimilar.forEach(value => {
            if(value.text != '')
                $scope.unidadDocumental.documentacionAsociada.fotografiaEncuadreSimilar.push(value.text);
        });
        $scope.unidadDocumental.documentacionAsociada.fotografiaEncuadreSimilar = $scope.unidadDocumental.documentacionAsociada.fotografiaEncuadreSimilar.length > 0 ? $scope.unidadDocumental.documentacionAsociada.fotografiaEncuadreSimilar : undefined;
        // grabadoRelacionado
        $scope.unidadDocumental.documentacionAsociada.grabadoRelacionado = [];
        $scope.auxiliar.grabadoRelacionado.forEach(value => {
            if(value.text != '')
                $scope.unidadDocumental.documentacionAsociada.grabadoRelacionado.push(value.text);
        });
        $scope.unidadDocumental.documentacionAsociada.grabadoRelacionado = $scope.unidadDocumental.documentacionAsociada.grabadoRelacionado.length > 0 ? $scope.unidadDocumental.documentacionAsociada.grabadoRelacionado : undefined;
    };

    // Sube una imagen al servidor.
    // El parametro element representa el contenido de <input type="file">
    // Si la imagen se sube al servidor exitosamente, se asigna el nombre del archivo al campo de imagen
    $scope.uploadFile = function(element){
        File.upload(element.files[0], '/imagenes', $scope.unidadDocumental.identificacion.codigoReferencia).
        then(function(res){
            if(res.data){
                if(res.data.success){
                    $scope.unidadDocumental.adicional.imagen = res.data.imagen; // Respuesta del API
                    
                    // Preview image. Source: https://stackoverflow.com/questions/4459379/preview-an-image-before-it-is-uploaded
                    let img = document.getElementById('img-preview');
                    img.file = element.files[0];
                    let reader = new FileReader();
                    reader.onload = (function(image){
                        return function(e){
                            image.src = e.target.result;
                        }
                    })(img);
                    reader.readAsDataURL(element.files[0]);
                }
            }
        }, function(res){
            console.error('Error de conexión con el servidor', res);
        })
    };

    // Borrar imagen. Elimina el archivo en el servidor y elimina su referencia en $scope.unidadDocumental.adicional.imagen
    $scope.borrarImagen = function(){
        if(!$scope.unidadDocumental.adicional.imagen)
            return;
        // Borrar archivo con el API:
        File.delete('imagenes/' + $scope.unidadDocumental.adicional.imagen).
        then(function(res){
            if(res.data.success)
                $scope.unidadDocumental.adicional.imagen = undefined; // Borrar el texto
        }, function(res){
            if(res.status === 404) // Si la imagen no existe, es porque ya fue borrada
                $scope.unidadDocumental.adicional.imagen = undefined;
            else{
                console.error('Error al borrar imagen', res);
                $scope.showToast('Error al borrar imagen');
            }
        });
    };

    // Envia la información a la base de datos para crear una nueva unidad documental
    $scope.enviarUnidadDocumental = function(){
    	cleanUnidadDocumentalData(); // crear una unidad documental válida
    	UnidadDocumental.create($scope.unidadDocumental).
    	then(function(res){
    		if(res.data.success){
                $scope.showToast(res.data.message);
                $location.url('/unidad?c=' + $routeParams.c);
            }
            else{
                console.error('Error al agregar unidad documental', res);
                $scope.showToast(res.data.message);
            }
    	}, function(res){
    		console.error('Error de conexión a la base de datos', res);
            $scope.showToast('Error de conexión');
    	});
    };

    // Envia la información a la base de datos para actualizar una unidad documental
    $scope.editarUnidadDocumental = function(){
        cleanUnidadDocumentalData(); // crear una unidad documental válida
        UnidadDocumental.update($routeParams.id, $scope.unidadDocumental).
        then(function(res){
            if(res.data.success){
                $scope.showToast(res.data.message);
                $location.url('/unidad?c=' + $routeParams.c);
            }
            else{
                console.error('Error al actualizar la unidad documental', res);
                $scope.showToast(res.data.message);
            }
        }, function(res){
            console.error('Error de conexión a la base de datos', res);
            $scope.showToast('Error de conexión');
        });
    };

    // Inicializaciones:

    // EDICION
    // Si se desea editar una unidad documental obtenemos la información almacenada en la base de datos
    if(/edit$/.test($location.path())){ // Prueba con expresión regular para saber si la URL termina con "edit"
        $scope.edit = true;
        UnidadDocumental.get($routeParams.id)
        .then(function(res){
            $scope.unidadDocumental = res.data;
            // Agregar un espacio adicional para seguir agregando autores
            $scope.unidadDocumental.identificacion.autores.push({tipo: '', nombre: ''});
            // Agregar un espacio adicional para seguir agregando inscripciones (en soporte primario y secundario)
            $scope.unidadDocumental.caracteristicasFisicas.soportePrimario.inscripciones.push({transcripcion: '', ubicacion: ''});
            $scope.unidadDocumental.caracteristicasFisicas.soporteSecundario.inscripciones.push({transcripcion: '', ubicacion: ''});
            // Agregar un espacio adicional para seguir agregando sellos
            $scope.unidadDocumental.caracteristicasFisicas.sellos.push({transcripcion: '', ubicacion: ''});
            // Parse para agregar valores de arreglos de texto en $scope.unidadDocumental a $scope.auxiliar. 
            // Se agrega un espacio en blanco para seguir agregando publicaciones. La misma técnica se emplea para varias propiedades.
            // publicaciones
            if($scope.unidadDocumental.publicaciones && $scope.unidadDocumental.publicaciones.publicacion && $scope.unidadDocumental.publicaciones.publicacion.length > 0){
                $scope.auxiliar.publicaciones = [];
                $scope.unidadDocumental.publicaciones.publicacion.forEach(value => {
                    $scope.auxiliar.publicaciones.push({text: value});
                });
                $scope.auxiliar.publicaciones.push({text: ''});
            }
            // exposicion
            if($scope.unidadDocumental.publicaciones && $scope.unidadDocumental.publicaciones.exposicion && $scope.unidadDocumental.publicaciones.exposicion.length > 0){
                $scope.auxiliar.exposicion = [];
                $scope.unidadDocumental.publicaciones.exposicion.forEach(value => {
                    $scope.auxiliar.exposicion.push({text: value});
                });
                $scope.auxiliar.exposicion.push({text: ''});
            }
            // fotografiaMismoNegativo
            if($scope.unidadDocumental.documentacionAsociada && $scope.unidadDocumental.documentacionAsociada.fotografiaMismoNegativo && $scope.unidadDocumental.documentacionAsociada.fotografiaMismoNegativo.length > 0){
                $scope.auxiliar.fotografiaMismoNegativo = [];
                $scope.unidadDocumental.documentacionAsociada.fotografiaMismoNegativo.forEach(value => {
                    $scope.auxiliar.fotografiaMismoNegativo.push({text: value});
                });
                $scope.auxiliar.fotografiaMismoNegativo.push({text: ''});
            }
            // fotografiaBase
            if($scope.unidadDocumental.documentacionAsociada && $scope.unidadDocumental.documentacionAsociada.fotografiaBase && $scope.unidadDocumental.documentacionAsociada.fotografiaBase.length > 0){
                $scope.auxiliar.fotografiaBase = [];
                $scope.unidadDocumental.documentacionAsociada.fotografiaBase.forEach(value => {
                    $scope.auxiliar.fotografiaBase.push({text: value});
                });
                $scope.auxiliar.fotografiaBase.push({text: ''});
            }
            // reprografia
            if($scope.unidadDocumental.documentacionAsociada && $scope.unidadDocumental.documentacionAsociada.reprografia && $scope.unidadDocumental.documentacionAsociada.reprografia.length > 0){
                $scope.auxiliar.reprografia = [];
                $scope.unidadDocumental.documentacionAsociada.reprografia.forEach(value => {
                    $scope.auxiliar.reprografia.push({text: value});
                });
                $scope.auxiliar.reprografia.push({text: ''});
            }
            // fotografiaMismaSecuencia
            if($scope.unidadDocumental.documentacionAsociada && $scope.unidadDocumental.documentacionAsociada.fotografiaMismaSecuencia && $scope.unidadDocumental.documentacionAsociada.fotografiaMismaSecuencia.length > 0){
                $scope.auxiliar.fotografiaMismaSecuencia = [];
                $scope.unidadDocumental.documentacionAsociada.fotografiaMismaSecuencia.forEach(value => {
                    $scope.auxiliar.fotografiaMismaSecuencia.push({text: value});
                });
                $scope.auxiliar.fotografiaMismaSecuencia.push({text: ''});
            }
            // fotografiaConsecutiva
            if($scope.unidadDocumental.documentacionAsociada && $scope.unidadDocumental.documentacionAsociada.fotografiaConsecutiva && $scope.unidadDocumental.documentacionAsociada.fotografiaConsecutiva.length > 0){
                $scope.auxiliar.fotografiaConsecutiva = [];
                $scope.unidadDocumental.documentacionAsociada.fotografiaConsecutiva.forEach(value => {
                    $scope.auxiliar.fotografiaConsecutiva.push({text: value});
                });
                $scope.auxiliar.fotografiaConsecutiva.push({text: ''});
            }
            // fotografiaConsecutivaOtraCamara
            if($scope.unidadDocumental.documentacionAsociada && $scope.unidadDocumental.documentacionAsociada.fotografiaConsecutivaOtraCamara && $scope.unidadDocumental.documentacionAsociada.fotografiaConsecutivaOtraCamara.length > 0){
                $scope.auxiliar.fotografiaConsecutivaOtraCamara = [];
                $scope.unidadDocumental.documentacionAsociada.fotografiaConsecutivaOtraCamara.forEach(value => {
                    $scope.auxiliar.fotografiaConsecutivaOtraCamara.push({text: value});
                });
                $scope.auxiliar.fotografiaConsecutivaOtraCamara.push({text: ''});
            }
            // fotografiaEncuadreSimilar
            if($scope.unidadDocumental.documentacionAsociada && $scope.unidadDocumental.documentacionAsociada.fotografiaEncuadreSimilar && $scope.unidadDocumental.documentacionAsociada.fotografiaEncuadreSimilar.length > 0){
                $scope.auxiliar.fotografiaEncuadreSimilar = [];
                $scope.unidadDocumental.documentacionAsociada.fotografiaEncuadreSimilar.forEach(value => {
                    $scope.auxiliar.fotografiaEncuadreSimilar.push({text: value});
                });
                $scope.auxiliar.fotografiaEncuadreSimilar.push({text: ''});
            }
            // grabadoRelacionado
            if($scope.unidadDocumental.documentacionAsociada && $scope.unidadDocumental.documentacionAsociada.grabadoRelacionado && $scope.unidadDocumental.documentacionAsociada.grabadoRelacionado.length > 0){
                $scope.auxiliar.grabadoRelacionado = [];
                $scope.unidadDocumental.documentacionAsociada.grabadoRelacionado.forEach(value => {
                    $scope.auxiliar.grabadoRelacionado.push({text: value});
                });
                $scope.auxiliar.grabadoRelacionado.push({text: ''});
            }
            // lugarDescrito (centrar el mapa solamente)
            if($scope.unidadDocumental.estructuraContenido && $scope.unidadDocumental.estructuraContenido.lugarDescrito)
                NgMap.getMap().then(function(map){
                    map.setCenter($scope.unidadDocumental.estructuraContenido.lugarDescrito.location);
                });
        }, function(res){
            console.error("Error de conexión para obtener información de la unidad documental", res);
        });
    } // FIN EDICION
    else{ // NO-EDICION. Crear nuevo registro.
        UnidadDocumental.next($routeParams.c). // Código de referencia con numeración automática (siguiente número disponible)
        then(function(res){
            $scope.unidadDocumental.identificacion.codigoReferencia = res.data.str;
            ConjuntoDocumental.prefix().
            then(function(res){
                $scope.unidadDocumental.identificacion.conjuntoPertenencia = res.data.prefijo + '-' + $routeParams.c;
            }, function(res){
                //fail
            });
        }, function(res){
            //fail
        });
    }
});