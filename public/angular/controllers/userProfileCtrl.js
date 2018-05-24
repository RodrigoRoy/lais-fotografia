angular.module('UserProfileCtrl',[]).controller('UserProfileController', function ($scope, $location){
    if(!$scope.user){
    	$scope.showToast('Acceso denegado. Requieres iniciar sesión');
    	$location.path('/');
    }
});