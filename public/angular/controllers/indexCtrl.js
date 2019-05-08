// Controlador principal que tiene alcanze en todo la página (incluyendo navbar y footer)

angular.module('IndexCtrl',[]).controller('IndexController', function ($scope, $location, $route, $rootScope, $mdSidenav, $mdToast, $mdDialog, Auth, ConjuntoDocumental, LocalStorage){
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

    // Envia a la página de búsqueda con el texto escrito en el input correspondiente
    $scope.search = function(){
        $location.url(`/search?q=${$scope.query}`);
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

	// Crea una nueva instancia de mdDialog para mostrar la información de una unidad documental
  $scope.showUnidadTabDialog = function(event, id){
      $mdDialog.show({
          controller: UnidadDialogController,
          templateUrl: 'angular/views/unidadDocumentalDialog.html',
          parent: angular.element(document.body),
          targetEvent: event,
          clickOutsideToClose: true,
          scope: $scope,
          preserveScope: true,
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
  function UnidadDialogController($scope, $mdDialog, $location, $mdToast, unidad, UnidadDocumental, File){
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

      // Elimina la unidad documental
      $scope.borrarUnidad = function(){
          UnidadDocumental.get(unidad). // Obtener la información (especialmente 'adicional.imagen')
          then(function(res){
              var unidadInfo = res.data;
              UnidadDocumental.delete(unidad). // Borrar el registro de la base de datos
              then(function(res){
                  if(res.data.success){
                      if(unidadInfo.adicional.imagen){ // Si la unidad tiene una imagen, borrarla
                          var filePath = '/imagenes/' + unidadInfo.adicional.imagen; // la ubicacion por default es '/imagenes'
                          File.delete(filePath).
                          then(function(response){
                              $scope.showToast(res.data.message);
                              $mdDialog.hide();
                              $scope.getUnidadesDocumentales(); // Recargar la lista de unidades documentales
                          }, function(response){
                              console.error('Error al borrar la imagen de la unidad documental', response);
                              $scope.showToast(res.data.message);
                              $mdDialog.hide();
                              $scope.getUnidadesDocumentales(); // Recargar la lista de unidades documentales
                          });
                      }
                      else{
                          $scope.showToast(res.data.message);
                          $mdDialog.hide();
                          $scope.getUnidadesDocumentales(); // Recargar la lista de unidades documentales
                      }
                  }
                  else{
                      console.error('Error al borrar la unidad documental', res);
                      $scope.showToast(res.data.message);
                  }
              }, function(res){
                  console.error('Error de conexión a la base de datos', res);
                  $scope.showToast('Error de conexión');
              });
          }, function(res){
              console.error('Error de conexión a la base de datos', res);
              $scope.showToast('Error de conexión');
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

      // Muestra un mensaje simple en pantalla. Su intención es dar aviso de ciertas alertas
      $scope.showToast = function(textMessage){
          $mdToast.show(
              $mdToast.simple()
                  .textContent(textMessage)
                  .position('bottom left')
                  .hideDelay(5000)
          );
      };

      // INICIALIZACIÓN
      $scope.getUnidadDocumental();
  }

	// Crea una nueva instancia de mdDialog para mostrar la información de un conjunto documental
	$scope.showConjuntoTabDialog = function(event, id){
			$mdDialog.show({
					controller: ConjuntoDialogController,
					templateUrl: 'angular/views/conjuntoDocumentalDialog.html',
					parent: angular.element(document.body),
					targetEvent: event,
					clickOutsideToClose: true,
					scope: $scope,
					preserveScope: true,
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
	function ConjuntoDialogController($scope, $mdDialog, $location, conjunto, ConjuntoDocumental){
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
					ConjuntoDocumental.suffix($scope.conjunto._id).
					then(function(res){
							let prefijo = res.data.sufijo;
							// let prefijo = /(\d+-?)*$/.exec(codigoReferencia)[0];
							ConjuntoDocumental.isLeaf(prefijo).
							then(function(res){
									if(res.data)
											$location.url('/unidad?c=' + prefijo);
									else
											$location.url('/conjunto?c=' + prefijo);
							}, function(res){
									console.error('Error de conexión con la base de datos', res);
							});
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

	// INICIALIZACION
	$scope.getConjuntosDocumentales();
	ConjuntoDocumental.name().
	then(function(res){
		$scope.nombreColeccion = res.data.name;
	}, function(res){
		$scope.nombreColeccion = 'Fotografía e investigación';
	});
});
