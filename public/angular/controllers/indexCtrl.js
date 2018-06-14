// Controlador principal que tiene alcanze en todo la página (incluyendo navbar y footer)

angular.module('IndexCtrl',[]).controller('IndexController', function ($scope, $location, $route, $rootScope, $mdSidenav, $mdToast, Auth, ConjuntoDocumental, LocalStorage){
	$scope.currentNavItem = 'inicio';
	$scope.nombreColeccion; // Nombre de la colección
	$scope.dynamicTheme = LocalStorage.get('theme') || 'dark'; // tema de color (definido en app.js)
	$scope.subconjuntos = []; // lista anhidada de todos los conjuntos y subconjuntos documentales
	$scope.user = undefined; // Información del usuario (si inicia sesión)

	// verificar si un usuario está con sesión iniciada en cada petición o cambio de ruta/página
	$rootScope.$on('$routeChangeStart', function(){
		Auth.getUser() // obtener la información del usuario
			.then(function(res){
				$scope.user = res.data;
				console.log('user: ', $scope.user);
			}, function(res){
				$scope.user = undefined;
				console.log('user: ', $scope.user);
				Auth.logout(); // Borra token en localStorage (evita errores al tener un token expirado)
			});
	});

	// Muestra/oculta el menu con la lista de conjuntos/subconjuntos
	$scope.toggleMenu = function(){
		$mdSidenav('menu').toggle();
	};

	// Cambia el nombre del tema para modificar la combinación de colores de todo el sitio
	$scope.toggleTheme = function(){
		if($scope.dynamicTheme === 'dark'){
			$scope.dynamicTheme = 'light';
			LocalStorage.set('theme', 'light');
		}
		else{
			$scope.dynamicTheme = 'dark';
			LocalStorage.set('theme', 'dark');
		}
	};

	// Envia al usuario a su página personal
	$scope.paginaPersonal = function(){
		if($scope.user)
			$location.url('/user/' + $scope.user.id);
	}

	// Envia al usuario a la página para logearse
	$scope.iniciarSesion = function(){
		$location.url('/login');
	};
	// Cierra sesión al eliminar el token del Local Storage del navegador
	$scope.cerrarSesion = function (){
		Auth.logout();
		$scope.user = {}; // reset toda la información del usuario
		$location.url('/');
		$route.reload(); // recargar index ('/') resetea $scope.user adecuadamente
	}

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
	ConjuntoDocumental.name().
	then(function(res){
		$scope.nombreColeccion = res.data.name;
	}, function(res){
		$scope.nombreColeccion = 'Fotografía e investigación';
	});
});