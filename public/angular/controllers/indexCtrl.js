// Controlador principal que tiene alcanze en todo la página (incluyendo navbar y footer)

angular.module('IndexCtrl',[]).controller('IndexController', function ($scope, $mdSidenav, ConjuntoDocumental){
	$scope.currentNavItem = 'inicio';

	$scope.toggleMenu = function(){
		$mdSidenav('menu').toggle();
	};

	// $scope.conjuntosListado = [];
	// $scope.getConjuntosDocumentales = function(){
	// 	ConjuntoDocumental.all().
	// 	then(function(res){
	// 		$scope.conjuntosListado = res.data;
	// 		console.log('conjuntosListado', $scope.conjuntosListado);
	// 	}, function(res){
	// 		console.error('Error de conexión a la base de datos', res);
	// 	})
	// };
	// $scope.getConjuntosDocumentales();
});