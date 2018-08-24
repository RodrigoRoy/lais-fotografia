// Controlador para las búsquedas de unidades documentales: lógica, vista y acciones a realizar
angular.module('SearchCtrl',[]).controller('SearchController', function ($scope, $routeParams, $location, UnidadDocumental){
    $scope.unidadesDocumentales = []; // Lista de unidades documentales que coinciden con el query de búsqueda

    // Petición a la base de datos para obtener resultados de la búsqueda
    // Los parámetros de búsqueda se obtienen directamente de la URL, aunque el único valor requerido es el de query (?q=)
    $scope.getUnidadesDocumentales = function(){
        let query = $routeParams.q ? $routeParams.q : '',
            limit = $routeParams.limit ? $routeParams.limit : '10',
            page = $routeParams.page ? $routeParams.page : '1',
            sort = $routeParams.sort ? $routeParams.sort : 'score',
            order = $routeParams.order ? $routeParams.order : 'asc';
        UnidadDocumental.search(query, limit, page, sort, order).
        then(function(res){
            $scope.unidadesDocumentales = res.data;
        }, function(res){
            console.error('Error con la base de datos', res);
            if(res.data && !res.data.success && res.data.message)
                $scope.showToast(res.data.message);
        });
    };

    // Prueba al dar clic a un elemento de la lista de resultados
    // Recibe el id de la unidad documental y el evento o elemento del DOM (para efectos de animación, si es necesario)
    $scope.showUnidadDocumental = function(unidadId, event){
        console.log(`id: ${unidadId}`);
    }

    // INICIALIZACIÓN
    $scope.getUnidadesDocumentales();
});