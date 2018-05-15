#!/bin/bash

# Move to the main folder 'lais-fotografia'
cd ../..

# Create config file
if ! [[ -e config.js ]] ; then
	cat <<EOF > config.js
module.exports = {
	port: 8081,
	db: 'mongodb://localhost:27017/lais-fotografia',
	prefix: 'MXIM',
	name: 'Fototecas Digitales'
}
EOF
fi

# Create public/files folder
mkdir "public/files"

command -v node >/dev/null 2>&1 || { echo >&2 "ERROR: Necesitas instalar NodeJS para continuar"; exit 1; }
command -v npm >/dev/null 2>&1 || { echo >&2 "ERROR: Necesitas instalar NPM (Node Package Manager) para continuar"; exit 1; }
echo "Instalando dependencias del servidor..."
npm install
echo "Instalando administrador de paquetes web Bower..."
npm install -g bower
echo "Instalando dependencias del cliente..."
bower install
echo "Proyecto instalado correctamente!"
