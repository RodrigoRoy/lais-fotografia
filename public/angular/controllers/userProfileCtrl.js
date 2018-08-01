angular.module('UserProfileCtrl',[]).controller('UserProfileController', function ($scope, $location, $mdDialog, Backup){
    if(!$scope.user){
    	$scope.showToast('Acceso denegado. Requieres iniciar sesión');
    	$location.path('/');
    }

    $scope.doingBackup = false; // Bandera para indicar que se está procesando una petición de backup

    // Redirige a la página de edición del usuario actual
    $scope.editarInformacion = function(){
		if($scope.user)
			$location.url('/user/' + $scope.user.id + '/edit');
	}

	// Redirige a la página con la lista de usuarios
	$scope.listaUsuarios = function(){
		if($scope.user && $scope.user.admin)
			$location.url('/user/list');
	}

	// Muestra una ventana o dialogo de confirmación para la creación de un respaldo
	// En caso de aceptar, la petición es enviada al servidor para la creación de un archivo zip con toda la información actual del sistema
	$scope.showDialogRespaldo = function(event){
        $mdDialog.show( // Mostrar el dialogo 
            $mdDialog.confirm() // "confirm" ya es dialogo preestablecido para confirmar una acción del usuario
                .title('Confirmar creación de respaldo')
                .htmlContent(`
                    <p>
                    	<i class="material-icons" style="vertical-align: middle;">warning</i> 
                    	Esta acción puede tardar en completarse.
                    </p>
                `)
                .ok('Crear respaldo')
                .cancel('Cancelar')
                .theme('delete-dialog-theme')
                .targetEvent(event)
        ).then(function(){ // En caso de que el usuario seleccione la opción "ok", es decir, confirmar respaldo
        	$scope.doingBackup = true;
        	Backup.dump()
        	.then(function(res){
        		$scope.doingBackup = false;
        		$scope.showToast('Respaldo creado exitosamente');
        	}, function(res){
        		$scope.doingBackup = false;
        		console.error('Error al crear respaldo', res);
        		$scope.showToast('Error al crear respaldo');
        	});
        }, function(){ // En caso de que el usuario seleccione la opción "cancel", es decir, no hacer respaldo
            // Hacer nada
        });
    };

    // Muestra una ventana o dialogo de confirmación para la restauración de información
    // En caso de aceptar, la petición es enviada al servidor para restaurar toda la información desde un respaldo previamente hecho
    $scope.showDialogRestauracion = function(event){
        $mdDialog.show( // Mostrar el dialogo 
            $mdDialog.confirm() // "confirm" ya es dialogo preestablecido para confirmar una acción del usuario
                .title('Confirmar restauración de información')
                .htmlContent(`
                    <p>
                    	<i class="material-icons" style="vertical-align: middle;">warning</i> 
                    	Esta acción puede provocar pérdida de información.
                    </p>
                `)
                .ok('Restaurar información')
                .cancel('Cancelar')
                .theme('delete-dialog-theme')
                .targetEvent(event)
        ).then(function(){ // En caso de que el usuario seleccione la opción "ok", es decir, confirmar restauración
        	$scope.doingBackup = true;
        	Backup.restore()
        	.then(function(res){
        		$scope.doingBackup = false;
        		$scope.showToast('Restauración completada exitosamente');
        	}, function(res){
        		$scope.doingBackup = false;
        		console.error('Error al restaurar información', res);
        		$scope.showToast('Error al restaurar información');
        	});
        }, function(){ // En caso de que el usuario seleccione la opción "cancel", es decir, no hacer restauración
            // Hacer nada
        });
    };
    
});