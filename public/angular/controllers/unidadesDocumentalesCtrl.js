// Controlador de la vista para unidades documentales
angular.module('UnidadesDocumentalesCtrl',[]).controller('UnidadesDocumentalesController', function ($scope, $routeParams, $location, $mdDialog, UnidadDocumental){
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

    // Redirige a la página para crear una unidad e integra el parámetro que indica el conjunto de procedencia
    $scope.crearUnidad = function(){
        $location.url('/unidad/nuevo?c=' + ($routeParams.c || ''));
    };

    // Crea una nueva instancia de mdDialog para mostrar la información de una unidad documental
    $scope.showTabDialog = function(event, id){
        $mdDialog.show({
            controller: DialogController,
            templateUrl: 'tabDialog.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: event,
            clickOutsideToClose:true,
            locals: {
                unidad: id
            }
        })
        .then(function(res){ // res es cualquier objeto devuelto de la llamada hide()
            // Success
        }, function(res){ // res es cualquier objeto devuelto de la llamada cancel()
            // Fail
        });
    };

    // Controlador interno para la creación de un mdDialog
    // Incluye servicios como $scope y $mdDialog.
    // Adicionalmente se puede inyectar el objeto "locals" del método $mdDialog.show() (que en este caso es 'unidad')
    function DialogController($scope, $mdDialog, $location, unidad, UnidadDocumental){
        $scope.unidad = {};

        // Obtiene la información de la unidad documental mediante el id dado como parámetro en los services del controlador (unidad)
        $scope.getUnidadDocumental = function(){
            UnidadDocumental.get(unidad).
            then(function(res){
                $scope.unidad = res.data;
            }, function(res){
                console.error('Error de conexión con la base de datos', err);
            });
        };

        // Envia a la página de edición para la unidad documental actual (mediante su Id)
        $scope.editarUnidad = function(){
            $mdDialog.hide();
            $location.path('/unidad/' + $scope.unidad._id + '/edit');
        };

        // Esconde el dialogo existente y acepta el promise devuelto desde $mdDialog.show()
        $scope.hide = function(res){
            $mdDialog.hide(res);
        };
        // Esconde el dialogo existente y rechaza el promise devuelto desde $mdDialog.show()
        $scope.cancel = function(res){
            $mdDialog.cancel(res);
        };

        // INICIALIZACIÓN
        $scope.getUnidadDocumental();
    }

    // INICIALIZACIÓN
    $scope.getUnidadesDocumentales();
});