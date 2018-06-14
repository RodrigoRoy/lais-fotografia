//Controlador de la página inicial

angular.module('InicioCtrl',[]).controller('InicioController', function ($scope, $location, Usuario){
	
    $scope.firstTime = false; // si es la primera vez que se muestra la página de inicio, es decir, cuando aún no hay usuarios registrados

    // INICIALIZACION
    Usuario.all()
    .then(function(res){
    	if(res.data && res.data.length === 0){
    		$scope.firstTime = true;
    	}
    }, function(res){
    	console.log('Error de conexión con la base de datos', res);
    });

});