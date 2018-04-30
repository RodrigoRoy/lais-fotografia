angular.module('UsuarioService', []).factory('Usuario', ['$http', function($http){
	return {
		me: function (){
			return $http.get('/api/usuarios/me');
		},

		// sign: function (usuarioData){
		// 	return $http.post('/api/authenticate', usuarioData);
		// },

		all: function(){
			return $http.get('/api/usuarios');
		},

		create: function(userInfo){
			return $http.post('api/usuarios', userInfo);
		},

		update: function(userId, userData){
			return $http.put('api/usuarios/' + userId, userData);
		},

		delete: function(userId){
			return $http.delete('api/usuarios/' + userId);
		}
	}
}]);