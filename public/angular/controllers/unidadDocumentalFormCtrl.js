// Controlador del formulario para un Conjunto Documental

angular.module('UnidadDocumentalFormCtrl',[]).controller('UnidadDocumentalFormController', function ($scope, $timeout, $q, UnidadDocumental){
	
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
			reglasNormas: "LAIS, Lineamientos para la descripción de fotografías, 2011"
		}
    };

    // Agrega un "nuevo" autor.
    // Recibe como parámetro el nombre escrito previamente como autor, si no es vacio, agrega un autor vacio (i.e. un nuevo input en blanco).
    $scope.agregarAutor = function(nombre){
    	if(nombre)
    		$scope.unidadDocumental.identificacion.autores.push({tipo: '', nombre: ''});
    };

    // Realiza los cambios necesarios en el objeto $scope.unidadDocumental para que sea aceptado por el modelo de la base de datos
    // - Limpia nombres (y tipos) de autores vacios
    var cleanUnidadDocumentalData = function(){
    	for(var i = $scope.unidadDocumental.identificacion.autores.length - 1; i >= 0; i--){
    		if(!$scope.unidadDocumental.identificacion.autores[i].nombre || !$scope.unidadDocumental.identificacion.autores[i].tipo)
    			$scope.unidadDocumental.identificacion.autores.splice(i, 1);
    	}
    };

    // Envia la información a la base de datos para crear un conjunto documental
    $scope.enviarUnidadDocumental = function(){
    	cleanUnidadDocumentalData(); // crear un conjunto documental válido
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
});