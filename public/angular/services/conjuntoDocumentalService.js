/* Servicio(Factory) que administra las llamadas a la base de datos en servidor*/

angular.module('ConjuntoDocumentalService', []).factory('ConjuntoDocumental', ['$http', function($http){
	return {
		// Obtiene todos los conjuntos documentales
		all: function(){
			return $http.get('/apifoto/conjuntoDocumental');
		},

		// Obtiene un conjunto documental. Recibe como parámetro el Id deseado
		get: function(conjuntoDocumentalId){
			return $http.get('/apifoto/conjuntoDocumental/' + conjuntoDocumentalId);
		},

		getByCode: function(codigoReferencia){
			return $http.get('/apifoto/conjuntoDocumental?code=' + codigoReferencia);
		},

		// Crear un nuevo conjunto documental. Recibe como parámetro todos los datos del conjunto
		create: function(conjuntoDocumentalData){
			return $http.post('/apifoto/conjuntoDocumental', conjuntoDocumentalData);
		},

		// Actualiza la información de un conjunto documental. Recibe como parámetros el Id y todos los nuevos datos del conjunto
		update: function(conjuntoDocumentalId, conjuntoDocumentalData){
			return $http.put('/apifoto/conjuntoDocumental/' + conjuntoDocumentalId, conjuntoDocumentalData);
		},

		// Elimina un conjunto documental. Recibe como parámetro el Id a borrar
		delete: function(conjuntoDocumentalId){
			return $http.delete('/apifoto/conjuntoDocumental/' + conjuntoDocumentalId);
		},

		// Obtiene el prefijo común de los conjuntos documentales
		prefix: function(){
			return $http.get('/apifoto/conjuntoDocumental/prefix');
		},

		// Obtiene el nombre principal de todos conjuntos documentales
		name: function(){
			return $http.get('/apifoto/conjuntoDocumental/name');
		},

		// Obtiene el sufijo (código de referencia sin prefijo) del conjunto. Recibe como parámetro el Id del conjunto
		suffix: function(conjuntoDocumentalId){
			return $http.get('/apifoto/conjuntoDocumental/' + conjuntoDocumentalId + '/suffix');
		},

		// Obtiene una lista anidada con los conjuntos y sus repectivos subconjuntos
		tree: function(){
			return $http.get('/apifoto/conjuntoDocumental/tree');
		},

		// Obtiene un arreglo de subconjuntos. Recibe como parámetro la cadena que representa el prefijo a buscar
		contains: function(conjuntoDocumentalPrefijo){
			return $http.get('/apifoto/conjuntoDocumental/contains?prefix=' + conjuntoDocumentalPrefijo);
		},

		// Determina si un conjunto ya no contiene más subconjuntos. Recibe como parámetro el prefijo del conjunto
		isLeaf: function(conjuntoDocumentalPrefijo){
			return $http.get('/apifoto/conjuntoDocumental/isLeaf?prefix=' + conjuntoDocumentalPrefijo);
		},

		// Obtiene la información sobre el próximo elemento en la numeración de los conjuntos documentales.
		// El prefijo dado como parámetro solamente incluye la numeración, por ejemplo: 3-1, 2-4-1, 1, etc.
		// En caso de que el parámetro sea vacío, se considera como la cadena vacia, haciendo referencia al conjunto documental "raíz"
		next: function(conjuntoDocumentalPrefijo){
			return $http.get('/apifoto/conjuntoDocumental/next?prefix=' + (conjuntoDocumentalPrefijo ? conjuntoDocumentalPrefijo : ''));
		}
	}
}]);