/*
Servicio para manejar todo lo referente a la autenticación de un usuario
*/

angular.module('AuthService', [])

// ===================================================
// auth factory para iniciar sesión y obtener información
// injecta $http para comunicarse con el API
// injecta $q para devolver objetos promise (asíncronos)
// injecta AuthToken para administrar tokens (local storage)
// ===================================================
.factory('Auth', function($http, $q, $cacheFactory, AuthToken) {
	// crear un objeto auth factory
	var authFactory = {};

	// iniciar sesión para un usuario
	authFactory.login = function(user){
		// devolver objeto promise y los datos
		return $http.post('/apifoto/authenticate', {
			name: user.name,
			password: user.password
		})
		.then(function(res){
			AuthToken.setToken(res.data.token); // guarda token en Local Storage del navegador
			return res;
		}, function(res){
			console.error("Error en autentificación de usuario: ", res);
			return res;
		});
	};

	// cerrar sesión de un usuario al eliminar el token (local storage)
	authFactory.logout = function(){
		// eliminar el token
		AuthToken.setToken();
		// eliminar cache (evita mal inicio de sesión al hacer logout/login como otro usuario y sin recargar la página)
		// source; http://stackoverflow.com/questions/17059569/how-to-refresh-invalidate-resource-cache-in-angularjs
		var $httpDefaultCache = $cacheFactory.get('$http');
		$httpDefaultCache.remove('/apifoto/usuarios/me');
	};

	// obtener al usuario que está con sesión iniciada
	authFactory.getUser = function(){
		if(AuthToken.getToken())
			return $http.get('/apifoto/usuarios/me', {cache: true}); // cache evita peticiones adicionales al servidor
		else
			return $q.reject({message: 'El usuario no tiene token'});
	};

	//devolver el objeto auth factory
	return authFactory;
})

// ===================================================
// factory  para manejar tokens (local storge)
// injectar $window para almacenar token cliente del lado del cliente
// ===================================================
.factory('AuthToken', function($window){

	var authTokenFactory = {};

	// obtener el token desde local storage
	authTokenFactory.getToken = function(){
		return $window.localStorage.getItem('token');
	};

	// función para establecer token o eliminarlo
	// si se recibe un token como parámetro, se establece el token
	// si no se recibe un token como parámetro, se elimina del local storage
	authTokenFactory.setToken = function(token){
		if(token)
			$window.localStorage.setItem('token', token);
		else
			$window.localStorage.removeItem('token');
	};

	return authTokenFactory;
})

// ===================================================
// configuración de aplicación para integrar token en peticiones
// ===================================================
.factory('AuthInterceptor', function($q, $location, AuthToken){

	var interceptorFactory = {};

	// esto sucederá en todas las peticiones HTTP
	interceptorFactory.request = function(config){
		// obtener el token
		var token = AuthToken.getToken();
		// si el token existe, agregarlo al encabezado como 'x-access-token'
		if(token)
			config.headers['x-access-token'] = token;
		return config;
	};

	// ocurre en respuestas con error
	interceptorFactory.responseError = function(response){
		// si el servidor devuelva una respuesta 403 forbidden
		if(response.status == 403)
			$location.path('/');
		// devuelve los errores del servidor como objeto promise
		return $q.reject(response);
	};

	return interceptorFactory;
});