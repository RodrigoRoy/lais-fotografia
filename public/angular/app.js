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
	'LocalStorageService',

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
.config(function($httpProvider){
	$httpProvider.interceptors.push('AuthInterceptor');
})

// Configuración de temas: elección de colores y creación de temas propios para AngularJS Material
.config(function($mdThemingProvider) {
	$mdThemingProvider.alwaysWatchTheme(true); // Dynamic themes
	// $mdThemingProvider.theme('default').primaryPalette('indigo').accentPalette('pink'); // Changing the default theme

	$mdThemingProvider.theme('light').primaryPalette('pink', {
		'default': '800',
		'hue-1': '100',
		'hue-2': 'A700',
		'hue-3': '900'
	}).accentPalette('pink', {
		'default': '900',
		'hue-1': '200',
		'hue-2': 'A700',
		'hue-3': '800'
	}).warnPalette('red').backgroundPalette('grey'); // Custom theme
	
	$mdThemingProvider.theme('dark').primaryPalette('pink', {
		'default': '800',
		'hue-1': '100',
		'hue-2': 'A700',
		'hue-3': '900'
	}).accentPalette('pink', {
		'default': '900',
		'hue-1': '200',
		'hue-2': 'A700',
		'hue-3': '800'
	}).warnPalette('red').backgroundPalette('grey').dark(); // Custom theme

	// $mdThemingProvider.theme('dark').primaryPalette('deep-purple').accentPalette('indigo').warnPalette('red').backgroundPalette('grey').dark(); // Custom theme
	$mdThemingProvider.theme('delete-dialog-theme').primaryPalette('red').accentPalette('grey').warnPalette('red').backgroundPalette('grey').dark(); // Custom theme
	$mdThemingProvider.setDefaultTheme('dark');
});