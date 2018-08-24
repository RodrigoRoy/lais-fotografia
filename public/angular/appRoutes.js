/*Administración de las rutas para mostrar y controlar en el front-end */

angular.module('viewsRoutes', []).config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider){
	
	$routeProvider
		.when('/', {
			templateUrl: 'angular/views/inicio.html',
			controller: 'InicioController'
		})

		.when('/conjunto', {
			templateUrl: 'angular/views/conjuntosDocumentales.html',
			controller: 'ConjuntosDocumentalesController'
		})

		.when('/conjunto/nuevo', {
			templateUrl: 'angular/views/conjuntoDocumentalForm.html',
			controller: 'ConjuntoDocumentalFormController'
		})

		.when('/conjunto/:id/edit', {
			templateUrl: 'angular/views/conjuntoDocumentalForm.html',
			controller: 'ConjuntoDocumentalFormController'
		})

		.when('/unidad', {
			templateUrl: 'angular/views/unidadesDocumentales.html',
			controller: 'UnidadesDocumentalesController'
		})

		.when('/unidad/nuevo', {
			templateUrl: 'angular/views/unidadDocumentalForm.html',
			controller: 'UnidadDocumentalFormController'
		})

		.when('/unidad/:id/edit', {
			templateUrl: 'angular/views/unidadDocumentalForm.html',
			controller: 'UnidadDocumentalFormController'
		})

		.when('/search', {
			templateUrl: 'angular/views/search.html',
			controller: 'SearchController'
		})

		.when('/user/list', {
			templateUrl: 'angular/views/userList.html',
			controller: 'UserListController'
		})

		.when('/user/new', {
			templateUrl: 'angular/views/userForm.html',
			controller: 'UserFormController'
		})

		.when('/user/:id/edit', {
			templateUrl: 'angular/views/userForm.html',
			controller: 'UserFormController'
		})

		.when('/user/:id', {
			templateUrl: 'angular/views/userProfile.html',
			controller: 'UserProfileController'
		})

		.when('/login', {
			templateUrl: 'angular/views/login.html',
			controller: 'LoginController'
		})

		// RUTAS INVÁLIDAS (no descritas previamente)
		.otherwise({
			redirectTo: '/'
		});
	

	// establecer el uso de URLS modernas (sin #)
	$locationProvider.html5Mode(true);
}]);