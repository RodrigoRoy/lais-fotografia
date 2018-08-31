// Controlador para las búsquedas de unidades documentales: lógica, vista y acciones a realizar
angular.module('SearchCtrl',[]).controller('SearchController', function ($scope, $routeParams, $location, UnidadDocumental){
    $scope.unidadesDocumentales = []; // Lista de unidades documentales que coinciden con el query de búsqueda
    // Parámetros de búsqueda:
    $scope.query = $routeParams.q ? $routeParams.q : ''; // texto a buscar
    $scope.limit = $routeParams.limit ? $routeParams.limit : '10'; // cantidad de resultados a obtener
    $scope.page = $routeParams.page ? parseInt($routeParams.page) : 1; // índice o página actual
    $scope.sort = $routeParams.sort ? $routeParams.sort : 'score', // forma de ordenar los resultados
    $scope.order = $routeParams.order ? $routeParams.order : 'asc'; // order de ordenación de los resultados
    $scope.loadingResults = false; // Indica si se están obteniendo resultados desde la base de datos
    $scope.noMoreResults = false; // Indica si ya no hay más resultados de la búsqueda y evita llamadas innecesarias a la base de datos

    // Petición a la base de datos para obtener resultados de la búsqueda
    // Los parámetros de búsqueda se obtienen directamente de la URL, aunque el único valor requerido es el de query (?q=)
    $scope.getUnidadesDocumentales = function(){
        UnidadDocumental.search($scope.query, $scope.limit, $scope.page, $scope.sort, $scope.order).
        then(function(res){
            $scope.unidadesDocumentales = res.data;
        }, function(res){
            console.error('Error con la base de datos', res);
            if(res.data && !res.data.success && res.data.message)
                $scope.showToast(res.data.message);
        });
    };

    // Obtención de más resultados desde la base de datos asíncronamente
    // Especialmente útil para scroll infinito
    $scope.loadMoreResults = function(){
        if($scope.noMoreResults) // Comprobación adicional al componente "infinite-scroll-disabled" en la vista
            return;
        $scope.loadingResults = true;
        $scope.page += 1; // En cada llamada se aumenta el índice de los resultados obtenidos
        UnidadDocumental.search($scope.query, $scope.limit, $scope.page, $scope.sort, $scope.order).
        then(function(res){
            if(res.data && res.data.length === 0)
                $scope.noMoreResults = true;
            $scope.unidadesDocumentales.push.apply($scope.unidadesDocumentales, res.data); // append de los nuevos resultados
            $scope.loadingResults = false;
        }, function(res){
            console.error('Error al cargar resultados: ', res);
            $scope.loadingResults = false;
        });
    };

    // INICIALIZACIÓN
    $scope.getUnidadesDocumentales();
});