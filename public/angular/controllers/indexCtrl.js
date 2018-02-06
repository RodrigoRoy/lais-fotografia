// Controlador principal que tiene alcanze en todo la página (incluyendo navbar y footer)

angular.module('IndexCtrl',[]).controller('IndexController', function ($scope, $mdSidenav, ConjuntoDocumental){
	$scope.currentNavItem = 'inicio';
	$scope.subconjuntos = []; // lista anhidada de todos los conjuntos y subconjuntos documentales

	// Muestra/oculta el menu con la lista de conjuntos/subconjuntos
	$scope.toggleMenu = function(){
		$mdSidenav('menu').toggle();
	};

	// Obtiene la lista con los conjuntos y subconjuntos ordenados
	$scope.getConjuntosDocumentales = function(){
		ConjuntoDocumental.tree().
		then(function(res){
			$scope.subconjuntos = res.data;
		}, function(res){
			console.error('Error de conexión a la base de datos', res);
		})
	};

	// INICIALIZACION
	$scope.getConjuntosDocumentales();
});