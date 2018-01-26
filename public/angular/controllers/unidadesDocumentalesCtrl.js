// Controlador de la vista para unidades documentales
angular.module('UnidadesDocumentalesCtrl',[]).controller('UnidadesDocumentalesController', function ($scope, UnidadDocumental){
    $scope.unidadesDocumentales = [];

    $scope.getUnidadesDocumentales = function(){
        UnidadDocumental.all().
        then(function(res){
            $scope.unidadesDocumentales = res.data;
            // console.log('unidadesDocumentales ', $scope.unidadesDocumentales);
        }, function(res){
            console.error('Error de conexión a la base de datos', res);
        })
    };

    $scope.getUnidadesDocumentales();
});