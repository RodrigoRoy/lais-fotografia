angular.module('laisFotoApp', [
	'ngRoute', // Front end router
	'ngMessages', // Manejador de validación en formularios
	'ngSanitize', // Mostrar HTML de manera segura
	'ngMaterial', // Angular Material (front end)
	'md.data.table', // Material design data table
	'angularTrix', // WYSIWYG text editor
	
	'viewsRoutes', // Rutas y controladores (appRoutes.js)

	'ConjuntoDocumentalService',
	'UnidadDocumentalService',
	'FileService',

	'IndexCtrl',
	'InicioCtrl',
	'ConjuntosDocumentalesCtrl',
	'UnidadesDocumentalesCtrl',
	'ConjuntoDocumentalFormCtrl',
	'UnidadDocumentalFormCtrl'
])

// configuración de aplicación para integrar token en peticiones
// .config(function($httpProvider){
// 	$httpProvider.interceptors.push('AuthInterceptor');
// })

// configuración para AngularJS Material chips
// .config(['$mdIconProvider', function($mdIconProvider{
// 	$mdIconProvider.icon('md-close', 'img/ic_close_24ox.svg', 24);
// })])

// .config(function($mdIconProvider){
// 	$mdIconProvider.fontSet('md', 'material-icons');
// })

// Configuración de temas: elección de colores y creación de temas propios para AngularJS Material
.config(function($mdThemingProvider) {
	$mdThemingProvider.alwaysWatchTheme(true); // Dynamic themes
	$mdThemingProvider.theme('default').primaryPalette('indigo').accentPalette('pink'); // Changing the default theme
	$mdThemingProvider.theme('dark-grey').backgroundPalette('grey').dark(); // Custom theme
	$mdThemingProvider.theme('new-blue-grey').primaryPalette('blue-grey').accentPalette('grey').warnPalette('red').backgroundPalette('grey'); // Custom theme
	$mdThemingProvider.setDefaultTheme('new-blue-grey');
});