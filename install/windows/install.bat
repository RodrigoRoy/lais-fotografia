@echo off

rem Move to the main folder 'lais-fotografia'
cd ..
cd ..

rem Create config file
if not exist config.js (
	(echo module.exports = { & echo 	port: 8080, & echo 	db: 'mongodb://localhost:27017/lais-fotografia', & echo 	prefix: 'MXIM', & echo 	name: 'Fototecas Digitales' & echo }) > config.js
)

rem Create public/files folder
mkdir "public\files" >nul

node --version >nul 2>&1 && (
	npm --version >nul 2>&1 && (
		echo Instalando dependencias del servidor...
		npm install
		echo Instalando administrador de paquetes web Bower...
		npm install -g bower
		echo Instalando dependencias del cliente...
		bower install
		echo Proyecto instalado correctamente!
		cmd /k
	) || (
		echo "ERROR: Necesitas reinstalar NodeJS e incluir NPM (Node Package Manager)"
		cmd /k
		exit /b 0
	)
) || (
	echo "ERROR: Necesitas instalar NodeJS para continuar"
	cmd /k
	exit /b 0
)
