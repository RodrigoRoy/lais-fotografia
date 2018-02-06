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
		},

		// Obtiene el prefijo común de los conjuntos documentales
		prefix: function(){
			return $http.get('/api/conjuntoDocumental/prefix');
		},

		// Obtiene una lista anidada con los conjuntos y sus repectivos subconjuntos
		tree: function(){
			return $http.get('/api/conjuntoDocumental/tree');
		},

		// Obtiene la información sobre el próximo elemento en la numeración de los conjuntos documentales.
		// El prefijo dado como parámetro solamente incluye la numeración, por ejemplo: 3-1, 2-4-1, 1, etc.
		// En caso de que el parámetro sea vacío, se considera como la cadena vacia, haciendo referencia al conjunto documental "raíz"
		next: function(conjuntoDocumentalPrefijo){
			return $http.get('/api/conjuntoDocumental/next?prefix=' + (conjuntoDocumentalPrefijo ? conjuntoDocumentalPrefijo : ''));
		}
	}
}]);