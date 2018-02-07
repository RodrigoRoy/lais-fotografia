// Controlador de la vista para unidades documentales
angular.module('UnidadesDocumentalesCtrl',[]).controller('UnidadesDocumentalesController', function ($scope, $routeParams, UnidadDocumental){
    $scope.unidadesDocumentales = []; // Lista con toda la información de las unidades documentales

    // Obtiene la información de todas las unidades documentales. Se pueden filtrar solo aquellas de pertenecen a una colección.
    // En este caso se debe indicar mediante el parámetro 'c' en la URL para indicar la numeración del conjunto
    $scope.getUnidadesDocumentales = function(){
        if($routeParams.c){
            UnidadDocumental.getByConjunto($routeParams.c).
            then(function(res){
                $scope.unidadesDocumentales = res.data;
            }, function(res){
                console.error('Error de conexión a la base de datos', res);
            });
        }else{ // Obtener todas las unidades si no se especifica el conjunto
            UnidadDocumental.all().
            then(function(res){
                $scope.unidadesDocumentales = res.data;
            }, function(res){
                console.error('Error de conexión a la base de datos', res);
            });
        }
    };

    // INICIALIZACIÓN
    $scope.getUnidadesDocumentales();
});