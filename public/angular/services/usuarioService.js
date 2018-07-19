angular.module('UsuarioService', []).factory('Usuario', ['$http', function($http){
	return {
		me: function (){
			return $http.get('/apifoto/usuarios/me');
		},

		sign: function (usuarioData){
			return $http.post('/apifoto/authenticate', usuarioData);
		},

		all: function(){
			return $http.get('/apifoto/usuarios');
		},

		get: function(usuarioId){
			return $http.get('/apifoto/usuarios/' + usuarioId);
		},

		create: function(userInfo){
			return $http.post('/apifoto/usuarios', userInfo);
		},

		update: function(userId, userData){
			return $http.put('/apifoto/usuarios/' + userId, userData);
		},

		delete: function(userId){
			return $http.delete('/apifoto/usuarios/' + userId);
		}
	}
}]);