// Controlador para las búsquedas de unidades documentales: lógica, vista y acciones a realizar
angular.module('SearchCtrl',[]).controller('SearchController', function ($scope, $routeParams, $location, UnidadDocumental, ConjuntoDocumental){
    $scope.unidadesDocumentales = []; // Lista de unidades documentales que coinciden con el query de búsqueda
    // Parámetros de búsqueda:
    $scope.query = $routeParams.q ? $routeParams.q : ''; // texto a buscar
    $scope.limit = $routeParams.limit ? $routeParams.limit : '0'; // cantidad de resultados a obtener (default 10 para paginación ó 0 para totales)
    $scope.page = $routeParams.page ? parseInt($routeParams.page) : 1; // índice o página actual
    $scope.sort = $routeParams.sort ? $routeParams.sort : 'score', // forma de ordenar los resultados
    $scope.order = $routeParams.order ? $routeParams.order : 'asc'; // order de ordenación de los resultados
    $scope.loadingResults = false; // Indica si se están obteniendo resultados desde la base de datos
    $scope.noMoreResults = false; // Indica si ya no hay más resultados de la búsqueda y evita llamadas innecesarias a la base de datos
    $scope.showMoreOptions = false; // Mostrar opciones de "búsqueda avanzada"
    $scope.searchForm = {}; // Objeto para guardar las opciones de la "búsqueda avanzada"
    // $scope.sortingMode = 'score asc';

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

    // Petición a la base de datos de obtener resultados de la búsqueda incluyendo unidades y conjuntos
    // Los parámetros de búsqueda se obtienen directamente de la URL, aunque el único valor requerido es el de query (?q=)
    $scope.getResultados = function(){
      $scope.loadingResults = true;
      $scope.resultados = [];
      UnidadDocumental.search($scope.query, $scope.limit, $scope.page, $scope.sort, $scope.order).
      then(function(res){
          $scope.unidadesDocumentales = res.data;
          $scope.unidadesDocumentales.forEach(function(unidad){
            unidad.tipo = 'unidad';
            $scope.resultados.push(unidad);
          });
          ConjuntoDocumental.search($scope.query, $scope.limit, $scope.page, $scope.sort, $scope.order).
          then(function(res){
            $scope.conjuntosDocumentales = res.data;
            $scope.conjuntosDocumentales.forEach(function(conjunto){
              conjunto.tipo = 'conjunto';
              $scope.resultados.push(conjunto);
            });
            // Ordenar por score
            $scope.resultados.sort(function(a, b){
              return b.score - a.score;
            });
            $scope.loadingResults = false;
          }, function(res){
            console.error('Error con la base de datos', res);
            if(res.data && !res.data.success && res.data.message)
                $scope.showToast(res.data.message);
          });
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

    // Realiza búsqueda incluyendo texto literal o texto a excluir en las búsquedas (similar a "búsqueda avanzada")
    $scope.search = function(){
        let newQuery = "";
        if($scope.searchForm.include)
            newQuery += $scope.searchForm.include;
        if($scope.searchForm.exact)
            newQuery += ` "${$scope.searchForm.exact}"`;
        if($scope.searchForm.exclude)
            newQuery += ` -${$scope.searchForm.exclude}`;
        $location.url(`/search?q=${newQuery.trim()}`);
    };

    // Determina el tipo de ordenamiento para mostrar los resultados de la búsqueda
    // Recarga la página indicando los parámetros adecuados desde URL
    // $scope.setSortingMode = function(){
    //     switch($scope.sortingMode){
    //         case 'score asc':
    //             $scope.sort = 'score';
    //             $scope.order = 'asc';
    //             break;
    //         case 'titulo asc':
    //             $scope.sort = 'identificacion.titulo.unica';
    //             $scope.order = 'asc';
    //             break;
    //         case 'titulo desc':
    //             $scope.sort = 'identificacion.titulo.unica';
    //             $scope.order = 'desc';
    //             break;
    //         case 'fecha asc':
    //             $scope.sort = 'identificacion.fecha.unica';
    //             $scope.order = 'asc';
    //             break;
    //         case 'fecha desc':
    //             $scope.sort = 'identificacion.fecha.unica';
    //             $scope.order = 'desc';
    //             break;
    //         default:
    //             $scope.sort = 'score';
    //             $scope.order = 'asc';
    //             break;
    //     }
    //     $location.url(`/search?q=${$scope.query}&sort=${$scope.sort}&order=${$scope.order}`);
    // };

    // INICIALIZACIÓN
    // $scope.getUnidadesDocumentales();
    $scope.getResultados();
});
