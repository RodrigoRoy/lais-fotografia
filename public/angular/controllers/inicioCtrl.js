//Controlador de la página inicial

angular.module('InicioCtrl',[]).controller('InicioController', function ($scope, $location, $routeParams){
	
    $scope.foo = 'Testing!';

    
    $scope.crearConjunto = function(){
    	$location.url('/conjunto/nuevo?c=' + ($routeParams.c || ''));
    };
});