angular.module('laisFotoApp', [
	'ngRoute', // Front end router
	'ngMessages', // Manejador de validación en formularios
	'ngMaterial', // Angular Material (front end)
	
	'viewsRoutes', // Rutas y controladores (appRoutes.js)

	'ConjuntoDocumentalService',
	'UnidadDocumentalService',

	'IndexCtrl',
	'InicioCtrl',
	'ConjuntoDocumentalFormCtrl',
	'UnidadDocumentalFormCtrl'
])

// configuración para AngularJS Material chips
// .config(['$mdIconProvider', function($mdIconProvider{
// 	$mdIconProvider.icon('md-close', 'img/ic_close_24ox.svg', 24);
// })])

// configuración de aplicación para integrar token en peticiones
// .config(function($httpProvider){
// 	$httpProvider.interceptors.push('AuthInterceptor');
// })