angular.module('LoginCtrl',[]).controller('LoginController', function ($scope, $location, Auth){
    $scope.usuario = {}; // Información del usuario en formulario Login
    $scope.processingLogin = false; // bandera para mostrar carga mientras se envia info a la base de datos

    $scope.iniciarSesion = function(){
        $scope.processingLogin = true;
        Auth.login($scope.usuario)
        .then(function(res){
            $scope.processingLogin = false;
            if(res.data.success){
                $location.path('/');
            }
            else{
                if(res.data.code === 'username' || res.data.code === 'password')
                    $scope.showToast(res.data.message);
                else
                    $scope.showToast('Error de conexión. Intente más tarde por favor');
            }
        }, function(res){
            console.error('Error de conexión a la base de datos', res);
            $scope.processingLogin = false;
            $scope.showToast('Error de conexión con la base de datos');
        });
    };

    // INICIALIZACION
    if($scope.user) // Si ya tienes sesión iniciada redirigir a otra página
        $location.url('/');
});