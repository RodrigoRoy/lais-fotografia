// Controlador del formulario para un Conjunto Documental

angular.module('ConjuntoDocumentalFormCtrl',[]).controller('ConjuntoDocumentalFormController', function ($scope, $timeout, $q, ConjuntoDocumental){
	
    // Objeto que representa toda la información del conjunto documental, como se describe en el modelo conjuntoDocumental.
    // Se pueden inicializar algunos valores por default.
    $scope.conjuntoDocumental = {
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
    		$scope.conjuntoDocumental.identificacion.autores.push({tipo: '', nombre: ''});
    };

    // Realiza los cambios necesarios en el objeto $scope.conjuntoDocumental para que sea aceptado por el modelo de la base de datos
    // - Limpia nombres (y tipos) de autores vacios
    var cleanConjuntoDocumentalData = function(){
    	for(var i = $scope.conjuntoDocumental.identificacion.autores.length - 1; i >= 0; i--){
    		if(!$scope.conjuntoDocumental.identificacion.autores[i].nombre || !$scope.conjuntoDocumental.identificacion.autores[i].tipo)
    			$scope.conjuntoDocumental.identificacion.autores.splice(i, 1);
    	}
    };

    // Envia la información a la base de datos para crear un conjunto documental
    $scope.enviarConjuntoDocumental = function(){
    	cleanConjuntoDocumentalData(); // crear un conjunto documental válido
    	console.log("Enviar ", $scope.conjuntoDocumental);
    	ConjuntoDocumental.create($scope.conjuntoDocumental).
    	then(function(res){
    		if(res.data.success)
    			console.log(res.data.message, res.data.data._id);
    	}, function(res){
    		console.error('Error de conexión a la base de datos', res);
    	})
    };
});