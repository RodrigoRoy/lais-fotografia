/* Servicio(Factory) que administra la forma en que se guarda información persistente en el navegador. Útil para configuraciones de preferencias*/
angular.module('LocalStorageService', []).factory('LocalStorage', ['$window', function($window){
	return {
		get: function(name){
			return $window.localStorage.getItem(name);
		},

		set: function(name, value){
			$window.localStorage.setItem(name, value);
		},

		remove: function(name){
			$window.localStorage.removeItem(name);
		}
	}
}]);