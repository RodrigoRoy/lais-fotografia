/* Servicio(Factory) que administra las llamadas para realizar respaldos y restauraciones de información*/

angular.module('BackupService', []).factory('Backup', ['$http', function($http){
	return {
		// Solicitud para la creación de un respaldo de la información
		dump: function(){
			return $http.get('/api/backup/dump');
		},

		// Solicitud para restaurar información a partir de un respaldo previamente realizado
		restore: function(fileLocation){
			return $http.post('/api/backup/restore', {});
		}
	}
}]);