/*Administración de las rutas para mostrar y controlar en el front-end */

angular.module('viewsRoutes', []).config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider){
	
	$routeProvider
		.when('/', {
			templateUrl: 'angular/views/inicio.html',
			controller: 'InicioController'
		})

		.when('/conjunto/nuevo', {
			templateUrl: 'angular/views/conjuntoDocumentalForm.html',
			controller: 'ConjuntoDocumentalFormController'
		})

		// .when('/unidad/nuevo', {
		// 	templateUrl: 'angular/views/unidadDocumentalForm.html',
		// 	controller: 'UnidadDocumentalFormController'
		// })

		// .when('/conjunto', {
		// 	templateUrl: 'angular/views/conjuntoDocumental.html',
		// 	controller: 'ConjuntoDocumentalController'
		// })

		// .when('/unidad', {
		// 	templateUrl: 'angular/views/unidadDocumental.html',
		// 	controller: 'UnidadDocumentalController'
		// })

		// RUTAS INVÁLIDAS (no descritas previamente)
		.otherwise({
			redirectTo: '/'
		});
	

	// establecer el uso de URLS modernas (sin #)
	$locationProvider.html5Mode(true);
}]);