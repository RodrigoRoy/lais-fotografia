/* Servicio(Factory) que administra las llamadas para el uso de archivos*/

angular.module('FileService', []).factory('File', ['$http', function($http){
	return {
		// Envia el contenido de una imagen y el texto que representa su código de referencia al api de archivos
		upload: function(fileData, codigoReferencia){
			var formData = new FormData(); // Equivalente a enviar un formulario
			formData.append('codigoReferencia', codigoReferencia);
			formData.append('file', fileData);
			
			return $http.post('/api/file', formData, {
				// establece Content-Type a multipart/form-data por default:
				headers: {'Content-Type': undefined},
				transformRequest: angular.identity
			});
		}
	}
}]);