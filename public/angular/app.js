angular.module('laisFotoApp', [
	'ngRoute', // Front end router
	'ngMessages', // Manejador de validación en formularios
	'ngMaterial', // Angular Material (front end)
	
	'viewsRoutes', // Rutas y controladores (appRoutes.js)

	'IndexCtrl',
	'InicioCtrl',
	'ConjuntoDocumentalFormCtrl'
])

// configuración de aplicación para integrar token en peticiones
// .config(function($httpProvider){
// 	$httpProvider.interceptors.push('AuthInterceptor');
// })