// Controlador principal que tiene alcanze en todo la página (incluyendo navbar y footer)

angular.module('IndexCtrl',[]).controller('IndexController', function ($scope, $location, $mdSidenav, ConjuntoDocumental){
	$scope.currentNavItem = 'inicio';
	$scope.subconjuntos = []; // lista anhidada de todos los conjuntos y subconjuntos documentales

	// Muestra/oculta el menu con la lista de conjuntos/subconjuntos
	$scope.toggleMenu = function(){
		$mdSidenav('menu').toggle();
	};

	// Reenvia a la página con las unidades documentales con mismo prefijo (que es el sufijo de la colección)
	$scope.gotoUnidad = function(suffix){
		$location.url('/unidad?c=' + suffix);
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