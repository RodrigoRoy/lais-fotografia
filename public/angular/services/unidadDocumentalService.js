/* Servicio(Factory) que administra las llamadas a la base de datos en servidor*/

angular.module('UnidadDocumentalService', []).factory('UnidadDocumental', ['$http', function($http){
	return {
		// Obtiene todas las unidades documentales
		all: function(){
			return $http.get('/api/unidadDocumental');
		},

		// Obtiene una unidad documental. Recibe como parámetro el Id deseado
		get: function(unidadDocumentalId){
			return $http.get('/api/unidadDocumental/' + unidadDocumentalId);
		},

		// Crear una nueva unidad documental. Recibe como parámetro todos los datos de la unidad
		create: function(unidadDocumentalData){
			return $http.post('/api/unidadDocumental', unidadDocumentalData);
		},

		// Actualiza la información de una unidad documental. Recibe como parámetros el Id y todos los nuevos datos de la unidad
		update: function(unidadDocumentalId, unidadDocumentalData){
			return $http.put('/api/unidadDocumental/' + unidadDocumentalId, unidadDocumentalData);
		},

		// Elimina una unidad documental. Recibe como parámetro el Id a borrar
		delete: function(unidadDocumentalId){
			return $http.delete('/api/unidadDocumental/' + unidadDocumentalId);
		}
	}
}]);