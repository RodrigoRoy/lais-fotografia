// Controlador de la vista para unidades documentales
angular.module('UnidadesDocumentalesCtrl',[]).controller('UnidadesDocumentalesController', function ($scope, $routeParams, $location, UnidadDocumental, ConjuntoDocumental){
    $scope.unidadesDocumentales = []; // Lista con toda la información de las unidades documentales
    $scope.breadcrumb = []; // Lista con los datos mínimos requeridos para indicar la ruta completa de conjuntos

    // Obtiene la información de todas las unidades documentales. Se pueden filtrar solo aquellas de pertenecen a una colección.
    // En este caso se debe indicar mediante el parámetro 'c' en la URL para indicar la numeración del conjunto
    $scope.getUnidadesDocumentales = function(){
        if($routeParams.c){
            UnidadDocumental.getByConjunto($routeParams.c).
            then(function(res){
                $scope.unidadesDocumentales = res.data;
                $scope.getBreadcrumb(); // obtener la información del menú de navegación
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

    // Obtiene la lista ordenada de conjuntos contenidos hasta el actual. Sirve para mostrar menú de navegación
    // La intención es llamar esta función justo después de obtener los conjuntos a mostrar en pantalla: getUnidadesDocumentales()
    $scope.getBreadcrumb = function(){
        ConjuntoDocumental.convertId($routeParams.c).
        then(function(res){
            if(res && res.data)
                ConjuntoDocumental.breadcrumb(res.data).
                then(function(res){
                    $scope.breadcrumb = res.data;
                }, function(res){
                    console.error('Error de conexión a la base de datos');
                });
        }, function(res){
            console.error('Error de conexión a la base de datos');
        })
    };

    // Redirige a la página para crear una unidad e integra el parámetro que indica el conjunto de procedencia
    $scope.crearUnidad = function(){
        $location.url('/unidad/nuevo?c=' + ($routeParams.c || ''));
    };

    // INICIALIZACIÓN
    $scope.getUnidadesDocumentales();
});