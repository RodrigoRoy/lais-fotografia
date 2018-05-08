// Controlador del formulario para crear nuevo usuario

angular.module('UserFormCtrl',[])
.directive('passwordVerify', function(){ // referencia: https://stackoverflow.com/questions/38539417/validating-password-and-confirm-password-fields-whenever-one-or-the-other-fields
	return {
		restrict: 'A', // only activate on element attribute
		require: '?ngModel', // get a hold of NgModelController
		link: function(scope, elem, attrs, ngModel){
			// if (!ngModel) return; // do nothing if no ng-model

			// watch own value and re-validate on change
			scope.$watch(attrs.ngModel, function(){
				validate();
			});

			// observe the other value and re-validate on change
			attrs.$observe('passwordVerify', function(){
				validate()
			});

			var validate = function(){
				ngModel.$setValidity('passwordVerify', ngModel.$viewValue === attrs.passwordVerify); //set validity
			};
		}
	};
})
.controller('UserFormController', function ($scope, $location, $routeParams, Usuario){
	// Representación de un usuario según el modelo de la base de datos
    $scope.usuario = {
    	admin: false,
    	permisos: {
    		create: true,
    		update: true,
    		delete: false
    	}
    };
    $scope.edit = false; // si se desea editar un usuario existente
    $scope.processingUser = false; // bandera para mostrar carga mientras se envia info a la base de datos

    // Envia la información del usuario a la base de datos.
    // Mientras ocurre, cambia el estado de $scope.processingUser para indicar al usuario que se está procesando la petición
    // Reenvia al usuario a la página con la lista de usuarios
    $scope.crearUsuario = function(){
    	$scope.processingUser = true;
    	Usuario.create($scope.usuario)
    	.then(function(res){
    		$scope.processingUser = false;
    		$scope.showToast('Usuario "' + $scope.usuario.username + '" creado');
    		$location.url('/user/list');
    	}, function(res){
    		console.error('Error de conexión a la base de datos', res);
    		$scope.processingUser = false;
    		$scope.showToast('Error de conexión con la base de datos');
    	});
    };

    // Envia la información del usuario a la base de datos.
    // Mientras ocurre, cambia el estado de $scope.processingUser para indicar al usuario que se está procesando la petición
    // Reenvia al usuario a la página con la lista de usuarios
    $scope.editarUsuario = function(){
    	$scope.processingUser = true;
    	Usuario.update($routeParams.id, $scope.usuario)
    	.then(function(res){
    		$scope.processingUser = false;
    		$scope.showToast('Usuario "' + $scope.usuario.username + '" actualizado');
    		$location.url('/user/list');
    	}, function(res){
    		console.error('Error de conexión a la base de datos', res);
    		$scope.processingUser = false;
    		$scope.showToast('Error de conexión con la base de datos');
    	});
    };

    // EDICION
    // Si se desea editar un usuario obtenemos la información almacenada en la base de datos
    if(/edit$/.test($location.path())){ // Prueba con expresión regular para saber si la URL termina con "edit"
        $scope.edit = true;
        Usuario.get($routeParams.id)
        .then(function(res){
            $scope.usuario = res.data;
        }, function(res){
            console.error("Error de conexión para obtener información del conjunto documental", res);
            $scope.showToast('Error de conexión con la base de datos');
        });
    } // FIN EDICION
});