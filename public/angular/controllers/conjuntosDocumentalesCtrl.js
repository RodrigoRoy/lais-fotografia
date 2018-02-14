// Controlador de la vista para conjuntos documentales
angular.module('ConjuntosDocumentalesCtrl',[]).controller('ConjuntosDocumentalesController', function ($scope, $routeParams, $mdDialog, ConjuntoDocumental){
    $scope.conjuntosDocumentales = []; // Lista de los conjuntos documentales

    // Obtiene la información de los conjuntos documentales. Se filtran solo aquellas de pertenecen a una colección.
    // En este caso se debe indicar mediante el parámetro 'c' en la URL para indicar la numeración del conjunto
    $scope.getConjuntosDocumentales = function(){
        ConjuntoDocumental.contains($routeParams.c ? $routeParams.c : '').
        then(function(res){
            $scope.conjuntosDocumentales = res.data;
        }, function(res){
            console.error('Error de conexión a la base de datos', res);
        });
    };

    // Crea una nueva instancia de mdDialog para mostrar la información de un conjunto documental
    $scope.showTabDialog = function(event, id){
        $mdDialog.show({
            controller: DialogController,
            templateUrl: 'tabDialog.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: event,
            clickOutsideToClose:true,
            locals: {
                conjunto: id
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
    // Adicionalmente se puede inyectar el objeto "locals" del método $mdDialog.show() (que en este caso es 'conjunto')
    function DialogController($scope, $mdDialog, $location, conjunto, ConjuntoDocumental){
        $scope.conjunto = {};

        // Obtiene la información del conjunto documental mediante el id dado como parámetro en los services del controlador (conjunto)
        $scope.getConjuntoDocumental = function(){
            ConjuntoDocumental.get(conjunto).
            then(function(res){
                $scope.conjunto = res.data;
            }, function(res){
                console.error('Error de conexión con la base de datos', err);
            });
        };

        // Envia a la página de edición para la conjunto documental actual (mediante su Id)
        $scope.editarConjunto = function(){
            $mdDialog.hide();
            $location.path('/conjunto/' + $scope.conjunto._id + '/edit');
        };

        $scope.verConjunto = function(codigoReferencia){
            $mdDialog.hide();
            let prefijo = /(\d+-?)*$/.exec(codigoReferencia)[0];
            ConjuntoDocumental.isLeaf(prefijo).
            then(function(res){
                if(res.data)
                    $location.url('/unidad?c=' + prefijo);
                else
                    $location.url('/conjunto?c=' + prefijo);
            }, function(res){
                console.error('Error de conexión con la base de datos', res);
            });
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
        $scope.getConjuntoDocumental();
    }

    // INICIALIZACIÓN
    $scope.getConjuntosDocumentales();
});