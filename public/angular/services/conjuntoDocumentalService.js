/* Servicio(Factory) que administra las llamadas a la base de datos en servidor*/

angular.module('ConjuntoDocumentalService', []).factory('ConjuntoDocumental', ['$http', function($http){
	return {
		// Obtiene todos los conjuntos documentales
		all: function(){
			return $http.get('/api/conjuntoDocumental');
		},

		// Obtiene un conjunto documental. Recibe como parámetro el Id deseado
		get: function(conjuntoDocumentalId){
			return $http.get('/api/conjuntoDocumental/' + conjuntoDocumentalId);
		},

		// Crear un nuevo conjunto documental. Recibe como parámetro todos los datos del conjunto
		create: function(conjuntoDocumentalData){
			return $http.post('/api/conjuntoDocumental', conjuntoDocumentalData);
		},

		// Actualiza la información de un conjunto documental. Recibe como parámetros el Id y todos los nuevos datos del conjunto
		update: function(conjuntoDocumentalId, conjuntoDocumentalData){
			return $http.put('/api/conjuntoDocumental/' + conjuntoDocumentalId, conjuntoDocumentalData);
		},

		// Elimina un conjunto documental. Recibe como parámetro el Id a borrar
		delete: function(conjuntoDocumentalId){
			return $http.delete('/api/conjuntoDocumental/' + conjuntoDocumentalId);
		}
	}
}]);