// Controlador del formulario para un Conjunto Documental

angular.module('UnidadDocumentalFormCtrl',[]).controller('UnidadDocumentalFormController', function ($scope, $timeout, $q, $location, $routeParams, UnidadDocumental){
	
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
		contexto: {},
		contenidoOrganizacion: {},
		condicionesAcceso: {},
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

    // Realiza los cambios necesarios en el objeto $scope.unidadDocumental para que sea aceptado por el modelo de la base de datos
    var cleanUnidadDocumentalData = function(){
        // Limpia nombres (y tipos) de autores vacios
    	for(var i = $scope.unidadDocumental.identificacion.autores.length - 1; i >= 0; i--)
    		if(!$scope.unidadDocumental.identificacion.autores[i].nombre || !$scope.unidadDocumental.identificacion.autores[i].tipo)
    			$scope.unidadDocumental.identificacion.autores.splice(i, 1);
    };

    // Envia la información a la base de datos para crear una unidad documental
    $scope.enviarUnidadDocumental = function(){
    	cleanUnidadDocumentalData(); // crear una unidad documental válida
    	console.log("Enviar ", $scope.unidadDocumental);
    	UnidadDocumental.create($scope.unidadDocumental).
    	then(function(res){
    		if(res.data.success)
    			console.log(res.data.message, res.data.data._id);
            else
                console.error('Error al agregar unidad documental', res);
    	}, function(res){
    		console.error('Error de conexión a la base de datos', res);
    	})
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
        })
    };

    // EDICION
    // Si se desea editar una unidad documental obtenemos la información almacenada en la base de datos
    if(/edit$/.test($location.path())){ // Prueba con expresión regular para saber si la URL termina con "edit"
        $scope.edit = true;
        UnidadDocumental.get($routeParams.id)
        .then(function(res){
            $scope.unidadDocumental = res.data;
            // Agregar un espacio adicional para seguir agregando autores
            $scope.unidadDocumental.identificacion.autores.push({tipo: '', nombre: ''});
        }, function(res){
            console.log("Error de conexión para obtener información de la unidad documental", res);
        });
    } // FIN EDICION
});