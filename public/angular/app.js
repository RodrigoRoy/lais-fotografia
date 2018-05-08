angular.module('laisFotoApp', [
	'ngRoute', // Front end router
	'ngMessages', // Manejador de validación en formularios
	'ngSanitize', // Mostrar HTML de manera segura
	'ngMaterial', // Angular Material (front end)
	'angularTrix', // WYSIWYG text editor
	'ngMap', // AngularJS Google Maps
	
	'viewsRoutes', // Rutas y controladores (appRoutes.js)

	'ConjuntoDocumentalService',
	'UnidadDocumentalService',
	'FileService',
	'UsuarioService',
	'AuthService',

	'IndexCtrl',
	'InicioCtrl',
	'ConjuntosDocumentalesCtrl',
	'UnidadesDocumentalesCtrl',
	'ConjuntoDocumentalFormCtrl',
	'UnidadDocumentalFormCtrl',
	'UserListCtrl',
	'UserFormCtrl',
	'UserProfileCtrl',
	'LoginCtrl'
])

// configuración de aplicación para integrar token en peticiones
// .config(function($httpProvider){
// 	$httpProvider.interceptors.push('AuthInterceptor');
// })

// Configuración de temas: elección de colores y creación de temas propios para AngularJS Material
.config(function($mdThemingProvider) {
	$mdThemingProvider.alwaysWatchTheme(true); // Dynamic themes
	$mdThemingProvider.theme('default').primaryPalette('indigo').accentPalette('pink'); // Changing the default theme
	$mdThemingProvider.theme('dark-grey').primaryPalette('deep-purple').accentPalette('grey').warnPalette('red').backgroundPalette('grey').dark(); // Custom theme
	$mdThemingProvider.theme('new-blue-grey').primaryPalette('blue-grey').accentPalette('grey').warnPalette('red').backgroundPalette('grey'); // Custom theme
	$mdThemingProvider.theme('delete-dialog-theme').primaryPalette('red').accentPalette('grey').warnPalette('red').backgroundPalette('grey').dark(); // Custom theme
	$mdThemingProvider.setDefaultTheme('dark-grey');
});