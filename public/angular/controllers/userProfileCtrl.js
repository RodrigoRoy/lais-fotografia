angular.module('UserProfileCtrl',[]).controller('UserProfileController', function ($scope, $location){
    if(!$scope.user){
    	$scope.showToast('Acceso denegado. Requieres iniciar sesión');
    	$location.path('/');
    }

    $scope.editarInformacion = function(){
		if($scope.user)
			$location.url('/user/' + $scope.user.id + '/edit');
	}

	$scope.listaUsuarios = function(){
		if($scope.user && $scope.user.admin)
			$location.url('/user/list');
	}
});