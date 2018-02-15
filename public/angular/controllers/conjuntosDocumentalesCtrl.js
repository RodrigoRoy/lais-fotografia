// Controlador de la vista para conjuntos documentales
angular.module('ConjuntosDocumentalesCtrl',[]).controller('ConjuntosDocumentalesController', function ($scope, $routeParams, $location, $mdDialog, ConjuntoDocumental){
    $scope.conjuntosDocumentales = []; // Lista de los conjuntos documentales
    $scope.isLeaf = true; // Indica si es un conjunto 'terminal', es decir, no se le deben agregar unidades pero puede agregar nuevos conjuntos
    $scope.isEmpty = true; // Indica si el conjunto está completamente vacio (sin subconjuntos ni unidades)

    // Obtiene la información de los conjuntos documentales. Se filtran solo aquellas de pertenecen a una colección.
    // En este caso se debe indicar mediante el parámetro 'c' en la URL para indicar la numeración del conjunto
    $scope.getConjuntosDocumentales = function(){
        ConjuntoDocumental.contains($routeParams.c ? $routeParams.c : '').
        then(function(res){
            $scope.conjuntosDocumentales = res.data;
            // Si es conjunto no tiene contenido, puede crear conjuntos y unidades documentales nuevas
            if($scope.conjuntosDocumentales && $scope.conjuntosDocumentales.length == 0)
                $scope.isEmpty = false;
            else
                $scope.isEmpty = true;
        }, function(res){
            console.error('Error de conexión a la base de datos', res);
        });
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
    $scope.canCreateUnidadDocumental();
});