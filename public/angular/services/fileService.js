/* Servicio(Factory) que administra las llamadas para el uso de archivos*/

angular.module('FileService', []).factory('File', ['$http', function($http){
	return {
		// Envia el contenido de una imagen, el nombre del directorio a guardar y su código de referencia al api de archivos
		upload: function(fileData, filePath, codigoReferencia){
			var formData = new FormData(); // Equivalente a enviar un formulario
			formData.append('file', fileData);
			formData.append('path', filePath);
			formData.append('codigoReferencia', codigoReferencia);

			return $http.post('/api/file', formData, {
				// establece Content-Type a multipart/form-data por default:
				headers: {'Content-Type': undefined},
				transformRequest: angular.identity
			});
		}
	}
}]);