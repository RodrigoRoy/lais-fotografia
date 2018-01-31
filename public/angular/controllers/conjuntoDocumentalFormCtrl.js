// Controlador del formulario para un Conjunto Documental

angular.module('ConjuntoDocumentalFormCtrl',[]).controller('ConjuntoDocumentalFormController', function ($scope, $timeout, $q, $location, $routeParams, $mdToast, ConjuntoDocumental){
	
    // Objeto que representa toda la información del conjunto documental, como se describe en el modelo conjuntoDocumental.
    // Se pueden inicializar algunos valores por default.
    $scope.conjuntoDocumental = {
    	identificacion: {
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
			reglasNormas: "LAIS, Lineamientos para la descripción de fotografías, 2011"
		}
    };
    $scope.edit = false; // Bandera para indicar si se está editando o creando un nuevo registro

    // Agrega un "nuevo" autor.
    // Recibe como parámetro el nombre escrito previamente como autor, si no es vacio, agrega un autor vacio (i.e. un nuevo input en blanco).
    $scope.agregarAutor = function(nombre){
        var lastAutor = $scope.conjuntoDocumental.identificacion.autores[$scope.conjuntoDocumental.identificacion.autores.length - 1];
    	if(nombre)
            if($scope.conjuntoDocumental.identificacion.autores.length == 1 || lastAutor.nombre != '') // se agrega autor vacio cuando es el primer autor agregado o cuando el último no es vacio
    		  $scope.conjuntoDocumental.identificacion.autores.push({tipo: '', nombre: ''});
    };

    // Realiza los cambios necesarios en el objeto $scope.conjuntoDocumental para que sea aceptado por el modelo de la base de datos
    var cleanConjuntoDocumentalData = function(){
        // Limpia nombres (y tipos) de autores vacios
    	for(var i = $scope.conjuntoDocumental.identificacion.autores.length - 1; i >= 0; i--)
    		if(!$scope.conjuntoDocumental.identificacion.autores[i].nombre || !$scope.conjuntoDocumental.identificacion.autores[i].tipo)
    			$scope.conjuntoDocumental.identificacion.autores.splice(i, 1);
    };

    // Envia la información a la base de datos para crear un conjunto documental
    $scope.enviarConjuntoDocumental = function(){
    	cleanConjuntoDocumentalData(); // crear un conjunto documental válido
    	ConjuntoDocumental.create($scope.conjuntoDocumental).
    	then(function(res){
    		if(res.data.success)
                console.log(res.data.message, res.data.data._id);
            else
                console.error('Error al agregar conjunto documental', res);
    	}, function(res){
    		console.error('Error de conexión a la base de datos', res);
    	});
    };

    // Envia la información a la base de datos para actualizar un conjunto documental
    $scope.editarConjuntoDocumental = function(){
        cleanConjuntoDocumentalData(); // crear un conjunto documental válido
        ConjuntoDocumental.update($routeParams.id, $scope.conjuntoDocumental).
        then(function(res){
            if(res.data.success)
                console.log(res.data.message);
            else
                console.error('Error al actualizar el conjunto documental', res);
        }, function(res){
            console.error('Error de conexión a la base de datos', res);
        });
    };

    // Inicializaciones

    // Código de referencia
    ConjuntoDocumental.next($routeParams.p).
    then(function(res){
        $scope.conjuntoDocumental.identificacion.codigoReferencia = res.data.str;
        ConjuntoDocumental.prefix().
        then(function(res){
            $scope.conjuntoDocumental.identificacion.conjuntoPertenencia = res.data.prefijo + '-' + $routeParams.p;
        }, function(res){
            //fail
        });
    }, function(res){
        //fail
    });


    // EDICION
    // Si se desea editar un conjunto documental obtenemos la información almacenada en la base de datos
    if(/edit$/.test($location.path())){ // Prueba con expresión regular para saber si la URL termina con "edit"
        $scope.edit = true;
        ConjuntoDocumental.get($routeParams.id)
        .then(function(res){
            $scope.conjuntoDocumental = res.data;
            // Agregar un espacio adicional para seguir agregando autores
            $scope.conjuntoDocumental.identificacion.autores.push({tipo: '', nombre: ''});
        }, function(res){
            console.error("Error de conexión para obtener información del conjunto documental", res);
        });
    } // FIN EDICION
});