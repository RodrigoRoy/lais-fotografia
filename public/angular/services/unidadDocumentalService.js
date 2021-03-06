/* Servicio(Factory) que administra las llamadas a la base de datos en servidor*/

angular.module('UnidadDocumentalService', []).factory('UnidadDocumental', ['$http', function($http){
	return {
		// Obtiene todas las unidades documentales
		all: function(){
			return $http.get('/api/unidadDocumental');
		},

		// Obtiene todas las unidades documentales de un conjunto documental específico
		// El parámetro indica la numeración del conjunto documental deseado, por ejemplo: 3-1. 2-4-1, 1, etc.
		getByConjunto: function(conjuntoDocumentalPrefijo){
			return $http.get('/api/unidadDocumental?from=' + conjuntoDocumentalPrefijo);
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
		},

		// Obtiene el prefijo común de las unidades documentales
		prefix: function(){
			return $http.get('/api/unidadDocumental/prefix');
		},

		// Obtiene el nombre principal de todas las unidades documentales
		name: function(){
			return $http.get('/api/unidadDocumental/name');
		},

		// Obtiene el sufijo (código de referencia sin prefijo) de la unidad documental. Recibe como parámetro el Id de la unidad documental
		suffix: function(unidadDocumentalId){
			return $http.get('/api/unidadDocumental/' + unidadDocumentalId + '/suffix');
		},

		// Obtiene la información sobre el próximo elemento en la numeración de las unidades documentales.
		// El parámetro no puede ser vacío y hace referencia al conjunto documental de pertenencia, por ejemplo: 3-1, 2-4-1, 1, etc.
		next: function(conjuntoDocumentalPrefijo){
			return $http.get('/api/unidadDocumental/next?from=' + conjuntoDocumentalPrefijo);
		},

		// Busca coincidencias de texto ya existentes en la base de datos
		// Recibe la cadena de texto a buscar como primer parámetro, por ejemplo: 'archivo'
		// Y como segundo parámetro el nombre completo de la propiedad donde se desea buscar, por ejemplo: 'identificacion.referenciaProcedencia'
		query: function(query, propiedad){
			return $http.get('/api/unidadDocumental/query?q=' + query + '&from=' + propiedad);
		},

		// Realiza búsquedas en la base de datos mediante textSearch
		// Recibe la cadena de texto a buscar (query), el límite de resultados, salto/skip de resultados (page), el campo a usar para ordernar y el tipo de orden (asc/desc)
		search: function(query, limit, page, sort, order){
			return $http.get('/api/unidadDocumental/search?q=' + query + '&limit=' + limit + '&page=' + page + '&sort=' + sort + '&order=' + order);
		},

		// Obtiene una lista ordenada con los conjuntos contenidos desde el conjunto actual hasta el conjunto principal de mayor alcance
		// breadcrumb: function(unidadDocumentalId){
		// 	return $http.get('/api/unidadDocumental/' + unidadDocumentalId + '/breadcrumb');
		// }
	}
}]);