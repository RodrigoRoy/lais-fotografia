/* Servicio(Factory) que administra las llamadas para el uso de archivos*/

angular.module('FileService', []).factory('File', ['$http', function($http){
	return {
		// Envia el contenido de un archivo, el nombre del directorio a guardar y su código de referencia al api de archivos
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
		},

		// Elimina el archivo (incluyendo ruta) dado como parámetro y que está contenido en la carpeta '/public/files'
		delete: function(fileLocation){
			return $http.delete('/api/file' + (fileLocation.charAt(0) === '/' ? fileLocation : '/' + fileLocation)); // Asegurar que fileLocation empieze con '/'
		}
	}
}]);