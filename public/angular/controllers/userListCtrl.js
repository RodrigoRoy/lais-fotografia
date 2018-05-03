angular.module('UserListCtrl',[]).controller('UserListController', function ($scope, $mdDialog, Usuario){
    $scope.usuarios = [];

    $scope.getUsuarios = function(){
        Usuario.all().
        then(function(res){
            $scope.usuarios = res.data;
        }, function(res){
            console.error('Error de conexión a la base de datos', res);
        });
    };

    // $scope.showDialogDelete = function(event){
    //     $mdDialog.show(
    //         $mdDialog.alert()
    //             .title('Borrar usuario')
    //             .textContent('Seguro que deseas borrar al usuario ?')
    //             .ariaLabel('Borrar usuario')
    //             .targetEvent(event)
    //             .ok('Borrar')
    //             .cancel('Cancelar');
    //     ).then(function(){
    //         console.log('Borrado');
    //     }, function(){
    //         console.log('Cancel');
    //     });
    // };

    // INICIALIZACIÓN
    $scope.getUsuarios();
});