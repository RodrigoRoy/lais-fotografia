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
        },
        active: true
    };
    $scope.edit = false; // si se desea editar un usuario existente
    $scope.editMyself = false; // si quien edita es el propio usuario logeado en el sistema
    $scope.processingUser = false; // bandera para mostrar carga mientras se envia info a la base de datos
    $scope.fistTime = false; // si es la primera vez que se registra un usuario administrador

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

    // INICIALIZACION

    // EDICION
    // Si se desea editar un usuario obtenemos la información almacenada en la base de datos
    if(/edit$/.test($location.path())){ // Prueba con expresión regular para saber si la URL termina con "edit"
        if(!$scope.user) // Acceso denegado sin token
            $location.url('/');

        $scope.edit = true;
        Usuario.get($routeParams.id)
        .then(function(res){
            $scope.usuario = res.data;
            if(!$scope.usuario._id){ // Si el id en URL es incorrecto/inválido
                $scope.showToast('ID de usuario incorrecto');
                $location.url('/');
            }
            else // Cuando el id en URL es válido
                if($scope.usuario._id === $scope.user.id) // Determinar si la edición es del propio usuario
                    $scope.editMyself = true;
                else
                    if(!$scope.user.admin){ // Si no es el propio usuario, debe ser un admin. En caso contrario, denegar acceso
                        $scope.showToast('Acceso denegado. Necesitas ser administrador');
                        $location.url('/');
                    }
        }, function(res){
            console.error("Error de conexión para obtener información del conjunto documental", res);
            $scope.showToast('Error de conexión con la base de datos');
        });
    } // FIN EDICION
    else{
        // Normalmente basta con verificar que exista un usuario logeado y sea administrador para crear un nuevo usuario en el sistema
        // Sin embargo, la excepción es cuando no hay usuarios registrados en la base de datos. 
        // En este caso hay que asegurar que el primer usuario a ingresar sea un administrador para que éste continue ingresando/registrando usuarios
        Usuario.all()
        .then(function(res){
            if(res.data && res.data.length != 0){
                // Este es el caso general para casi todas las demás circunstancias
                if(!$scope.user || !$scope.user.admin){ // Solamente los admin pueden agregar nuevo usuario (TODO: Autoregistro de usuarios?)
                    $scope.showToast('Acceso denegado. Necesitas ser administrador!');
                    $location.url('/');
                }
            }
            else{ // Este es el caso para ingresar al primer admin, hay que asegurar que tenga los permisos necesarios
                $scope.usuario.admin = true;
                $scope.usuario.permisos.create = true;
                $scope.usuario.permisos.update = true;
                $scope.usuario.permisos.delete = true;
                $scope.firstTime = true;
            }
        }, function(res){
            console.error("Error de conexión", res); // Comúnmente debido a la falta de token cuando ya hay al menos un admin registrado
            $scope.showToast('Acceso denegado. Necesitas ser administrador');
        });
    }
    
});