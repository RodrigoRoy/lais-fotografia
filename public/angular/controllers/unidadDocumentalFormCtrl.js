// Controlador del formulario para un Conjunto Documental

angular.module('UnidadDocumentalFormCtrl',[]).controller('UnidadDocumentalFormController', function ($scope, $timeout, $q, $location, $routeParams, $route, UnidadDocumental, ConjuntoDocumental, File){
	
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
		contenidoEstructura: {},
        caracteristicasFisicas: {
            soportePrimario:{
                inscripciones: [{
                    transcripcion: '',
                    ubicacion: ''
                }]
            },
            soporteSecundario:{
                inscripciones: [{
                    transcripcion: '',
                    ubicacion: ''
                }]
            },
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
    $scope.edit = false; // Bandera para indicar si se está editando o creando un nuevo registro

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

    // Sube una imagen al servidor.
    // El parametro element representa el contenido de <input type="file">
    // Si la imagen se sube al servidor exitosamente, se asigna el nombre del archivo al campo de imagen
    $scope.uploadFile = function(element){
        File.upload(element.files[0], $scope.unidadDocumental.identificacion.codigoReferencia).
        then(function(res){
            if(res.data){
                if(res.data.success){
                    $scope.unidadDocumental.adicional.imagen = res.data.imagen;
                    console.log(res.data.message);
                }
            }
        }, function(res){
            console.error('Error de conexión con el servidor', res);
        })
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
    };

    // Envia la información a la base de datos para crear una unidad documental
    $scope.enviarUnidadDocumental = function(){
    	cleanUnidadDocumentalData(); // crear una unidad documental válida
    	console.log("Enviar ", $scope.unidadDocumental);
    	UnidadDocumental.create($scope.unidadDocumental).
    	then(function(res){
    		if(res.data.success){
                console.log(res.data.message, res.data.data._id);
    			alert(res.data.message);
                $route.reload();
            }
            else{
                console.error('Error al agregar unidad documental', res);
                alert(res.data.message);
                $route.reload();
            }
    	}, function(res){
    		console.error('Error de conexión a la base de datos', res);
    	});
    };

    // Envia la información a la base de datos para actualizar una unidad documental
    $scope.editarUnidadDocumental = function(){
        cleanUnidadDocumentalData(); // crear una unidad documental válida
        UnidadDocumental.update($routeParams.id, $scope.unidadDocumental).
        then(function(res){
            if(res.data.success)
                console.log(res.data.message);
            else
                console.error('Error al actualizar la unidad documental', res);
        }, function(res){
            console.error('Error de conexión a la base de datos', res);
        });
    };

    // Inicializaciones

    // Código de referencia
    UnidadDocumental.next($routeParams.c).
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
        }, function(res){
            console.error("Error de conexión para obtener información de la unidad documental", res);
        });
    } // FIN EDICION
});