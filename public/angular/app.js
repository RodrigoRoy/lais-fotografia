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
	'BackupService',

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
})

// Traducción al español de algunos textos en el calendario y las fechas que muestra
.config(function($mdDateLocaleProvider){
	$mdDateLocaleProvider.months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    $mdDateLocaleProvider.shortMonths = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    $mdDateLocaleProvider.days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    $mdDateLocaleProvider.shortDays = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'];
    $mdDateLocaleProvider.formatDate = function(date){
    	return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
    };
    $mdDateLocaleProvider.weekNumberFormatter = function(weekNumber){
    	return 'Semana ' + weekNumber;
    };
    $mdDateLocaleProvider.msgCalendar = 'Calendario';
    $mdDateLocaleProvider.msgOpenCalendar = 'Abrir calendario';
});