// Controlador principal que tiene alcanze en todo la página (incluyendo navbar y footer)

angular.module('IndexCtrl',[]).controller('IndexController', function ($scope, $location, $rootScope, $mdSidenav, $mdToast, Auth, ConjuntoDocumental){
	$scope.currentNavItem = 'inicio';
	$scope.subconjuntos = []; // lista anhidada de todos los conjuntos y subconjuntos documentales
	$scope.user = {}; // Información del usuario (si inicia sesión)

	// verificar si un usuario está con sesión iniciada en cada petición o cambio de ruta/página
	$rootScope.$on('$routeChangeStart', function(){
		Auth.getUser() // obtener la información del usuario
			.then(function(res){
				$scope.user = res.data;
				console.log('res: ', res);
				console.log('user: ', $scope.user);
			}, function(res){
				$scope.user = {};
				console.log('user: ', $scope.user);
				Auth.logout(); // Borra token en localStorage (evita errores al tener un token expirado)
			});
	});

	$scope.iniciarSesion = function(){
		$location.url('/login');
	};
	// Cierra sesión al eliminar el token del Local Storage del navegador
	$scope.cerrarSesion = function (){
		Auth.logout();
		$scope.user = {}; // reset toda la información del usuario
		$location.path('/');
	}

	// Muestra/oculta el menu con la lista de conjuntos/subconjuntos
	$scope.toggleMenu = function(){
		$mdSidenav('menu').toggle();
	};

	// Reenvia a la página del conjunto documental con el prefijo dado (que es en realidad el sufijo de la colección)
	$scope.verConjunto = function(suffix){
        ConjuntoDocumental.isLeaf(suffix).
        then(function(res){
            if(res.data)
                $location.url('/unidad?c=' + suffix);
            else
                $location.url('/conjunto?c=' + suffix);
        }, function(res){
            console.error('Error de conexión con la base de datos', res);
        });
    };

	// Obtiene la lista con los conjuntos y subconjuntos ordenados
	$scope.getConjuntosDocumentales = function(){
		ConjuntoDocumental.tree().
		then(function(res){
			$scope.subconjuntos = res.data;
		}, function(res){
			console.error('Error de conexión a la base de datos', res);
		})
	};

	// Muestra un mensaje simple en pantalla. Su intención es dar aviso de ciertas alertas
	$scope.showToast = function(textMessage){
		$mdToast.show(
			$mdToast.simple()
				.textContent(textMessage)
				.position('bottom left')
				.hideDelay(5000)
		);
	};

	// INICIALIZACION
	$scope.getConjuntosDocumentales();
});