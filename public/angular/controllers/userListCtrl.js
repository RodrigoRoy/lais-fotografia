angular.module('UserListCtrl',[]).controller('UserListController', function ($scope, $mdDialog, $location, Usuario){
    $scope.usuarios = []; // Lista de usuarios

    // Obtiene la lista de usuarios desde la base de datos
    $scope.getUsuarios = function(){
        Usuario.all().
        then(function(res){
            $scope.usuarios = res.data;
            $scope.usuarios.forEach(usuario => {
                usuario.permisosFormatted = permisosToString(usuario); // Permisos en forma de texto
            });
        }, function(res){
            console.error('Error de conexión a la base de datos', res);
        });
    };

    // Muestra un objeto "dialog" para confirmar el borrado de un usuario.
    // Recibe como parámetro toda la información del usuario a eliminar y el DOM object donde se dió click (para efectos de animación)
    $scope.showDialogDelete = function(usuario, event){
        $mdDialog.show( // Mostrar el dialogo 
            $mdDialog.confirm() // "confirm" ya es dialogo preestablecido para confirmar una acción del usuario
                .title('Borrar usuario')
                .htmlContent(`
                    <p>
                        ¿Estás seguro de borrar al usuario <strong>${usuario.username}</strong>?
                    </p>
                    <p>
                        <small>NOTA: Esta operación no se puede deshacer.</small>
                    </p>
                `)
                .ok('Borrar')
                .cancel('Cancelar')
                .theme('delete-dialog-theme')
                .targetEvent(event)
        ).then(function(){ // En caso de que el usuario seleccione la opción "ok", es decir, borrar un usuario
            Usuario.delete(usuario._id)
            .then(function(res){
                $scope.getUsuarios(); // Actualiza la lista de usuarios (equivalente a recargar la página)
                $scope.showToast(`Se ha borrado al usuario ${usuario.username}`);
            }, function(res){
                console.error('Error de conexión a la base de datos', res);
                $scope.showToast('Error de conexión con la base de datos');
            });
        }, function(){ // En caso de que el usuario seleccione la opción "cancel", es decir, no borre al usuario
            // No hacer nada
        });
        // Otra forma de crear un dialog personalizado y con controlador propio:
        // $mdDialog.show({
        //     targetEvent: event,
        //     template: `
        //         <md-dialog layout-padding>
        //             <md-dialog-content>
        //                 <p>
        //                     ¿Estás seguro de borrar al usuario "${usuario.username}"?
        //                 </p>
        //                 <p>
        //                     NOTA: Esta operación no se puede deshacer.
        //                 </p>
        //             </md-dialog-content>
        //             <md-dialog-actions>
        //                 <md-button class="md-raised" ng-click="closeDialog()">Cancelar</md-button>
        //                 <md-button class="md-warn md-raised" ng-click="deleteUser()">Borrar</md-button>
        //             </md-dialog-actions>
        //         </md-dialog>
        //     `,
        //     clickOutsideToClose: true,
        //     locals: {
        //         usuario: usuario
        //     },
        //     controller: DialogController
        // });
        // function DialogController($scope, $mdDialog, usuario){
        //     $scope.usuario = usuario;
        //     $scope.closeDialog = function(){
        //         $mdDialog.hide();
        //     };
        //     $scope.deleteUser = function(){
        //         console.log('Deleting user...');
        //     };
        // }
    };

    // Envia a la página de edición de usuario
    // Recibe como parámetro la información del usuario, esto permite obtener su id para redireccionar correctamente
    $scope.editUser = function(usuario){
        $location.path('/user/' + usuario._id + '/edit');
    };

    // Envia a la página de creación de usuario
    $scope.createUser = function(){
        $location.path('/user/new');
    };

    // Auxiliar para formatear el texto de los usuarios
    // Recibe como parámetro la información del usuario que contiene la propiedad "permisos" en formato booleano
    let permisosToString = function(usuario){
        let permisosString = [];
        if(usuario.permisos.create)
            permisosString.push('creación');
        if(usuario.permisos.update)
            permisosString.push('actualización');
        if(usuario.permisos.delete)
            permisosString.push('borrado');
        let result = permisosString.join(', ');
        if(result.length === 0)
            return '';
        return result[0].toUpperCase() + result.substr(1);
    };

    // INICIALIZACIÓN
    $scope.getUsuarios();
});