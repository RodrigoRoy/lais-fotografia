// Controlador del formulario para un Conjunto Documental

angular.module('ConjuntoDocumentalFormCtrl',[]).controller('ConjuntoDocumentalFormController', function ($scope){
	
    $scope.conjuntoDocumental = {
    	identificacion: {},
		contexto: {},
		contenidoOrganizacion: {},
		condicionesAcceso: {},
		documentacionAsociada: {},
		publicaciones: {},
		controlDescripcion: {}
    };
});