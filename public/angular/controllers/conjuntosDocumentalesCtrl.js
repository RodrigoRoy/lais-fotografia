// Controlador de la vista para conjuntos documentales
angular.module('ConjuntosDocumentalesCtrl',[]).controller('ConjuntosDocumentalesController', function ($scope, $routeParams, $location, $mdDialog, ConjuntoDocumental){
    $scope.conjuntosDocumentales = []; // Lista de los conjuntos documentales
    $scope.isLeaf = true; // Indica si es un conjunto 'terminal', es decir, no se le deben agregar unidades pero puede agregar nuevos conjuntos
    $scope.isEmpty = true; // Indica si el conjunto está completamente vacio (sin subconjuntos ni unidades)
    $scope.breadcrumb = []; // Lista con los datos mínimos requeridos para indicar la ruta completa de conjuntos

    // Obtiene la información de los conjuntos documentales. Se filtran solo aquellas que pertenecen a una colección.
    // En este caso se debe indicar mediante el parámetro 'c' en la URL para indicar la numeración del conjunto
    $scope.getConjuntosDocumentales = function(){
        ConjuntoDocumental.contains($routeParams.c ? $routeParams.c : '').
        then(function(res){
            $scope.conjuntosDocumentales = res.data;
            $scope.getBreadcrumb(); // obtener la información del menú de navegación
            // Si es conjunto no tiene contenido, puede crear conjuntos y unidades documentales nuevas
            if($scope.conjuntosDocumentales && $scope.conjuntosDocumentales.length == 0)
                $scope.isEmpty = false;
            else
                $scope.isEmpty = true;
        }, function(res){
            console.error('Error de conexión a la base de datos', res);
        });
    };

    // Obtiene la lista ordenada de conjuntos contenidos hasta el actual. Sirve para mostrar menú de navegación
    // La intención es llamar esta función justo después de obtener los conjuntos a mostrar en pantalla: getConjuntosDocumentales()
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

    // Determina si el conjunto actual puede crear unidades documentales.
    // Esto requiere verificar si el conjunto contiene otros conjuntos o si ya está albergando unidades documentales.
    // Debido a que ambas condiciones son mutuamente excluyentes, se verifica si el conjunto es una "hoja".
    $scope.canCreateUnidadDocumental = function(){
        var prefijo = $routeParams.c ? $routeParams.c : ''
        ConjuntoDocumental.isLeaf(prefijo).
            then(function(res){
                if(res.data)
                    $scope.isLeaf = true;
                else
                    $scope.isLeaf = false;
            }, function(res){
                console.error('Error de conexión con la base de datos', res);
            });
    };

    // Redirige a la página para crear un conjunto e integra el parámetro que indica el conjunto de procedencia
    $scope.crearConjunto = function(){
        $location.url('/conjunto/nuevo?c=' + ($routeParams.c || ''));
    };
    // Redirige a la página para crear una unidad e integra el parámetro que indica el conjunto de procedencia
    $scope.crearUnidad = function(){
        $location.url('/unidad/nuevo?c=' + ($routeParams.c || ''));
    };

    // INICIALIZACIÓN
    $scope.getConjuntosDocumentales();
    $scope.canCreateUnidadDocumental();
});
