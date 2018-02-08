// Controlador de la vista para unidades documentales
angular.module('UnidadesDocumentalesCtrl',[]).controller('UnidadesDocumentalesController', function ($scope, $routeParams, $mdDialog, UnidadDocumental){
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

    $scope.showTabDialog = function(event, id){
        $mdDialog.show({
            controller: DialogController,
            templateUrl: 'tabDialog.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: event,
            clickOutsideToClose:true,
            locals: {
                unidadId: id
            }
        })
        .then(function(answer){
            console.log('You said the information was "' + answer + '".');
            console.log('$scope.unidadesDocumentales', $scope.unidadesDocumentales);
        }, function(){
            console.log('You cancelled the dialog.');
        });
    };

    function DialogController($scope, $mdDialog, $location, unidadId, UnidadDocumental){
        $scope.unidad = {};

        UnidadDocumental.get(unidadId).
        then(function(res){
            $scope.unidad = res.data;
        }, function(res){
            console.error('Error de conexión con la base de datos', err);
        });

        $scope.editarUnidad = function(){
            $mdDialog.hide('Editar');
            $location.path('/unidad/' + $scope.unidad._id + '/edit');
        };

        $scope.hide = function(){
            $mdDialog.hide();
        };

        $scope.cancel = function(){
            $mdDialog.cancel();
        };

        $scope.answer = function(answer){
            $mdDialog.hide(answer);
        };
    }


    // INICIALIZACIÓN
    $scope.getUnidadesDocumentales();
});