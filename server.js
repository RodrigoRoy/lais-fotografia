/*
Manejo del servidor (Node.js)
*/

console.log('Inicializando servidor...');

// MÓDULOS =================================================
var express        = require('express'); // llamar a express
var app            = express(); // definir la aplicación usando express
var mongoose       = require('mongoose'); // para trabajar con la base de datos
var bodyParser     = require('body-parser'); // obtener body-parser
var methodOverride = require('method-override');
var morgan         = require('morgan'); // usado para ver peticiones (requests)

// CONFIGURACIÓN ===========================================

// archivo de configuración
var config = require('./config');

// base de datos
var port = config.port || process.env.PORT || 8080; // establecer puerto
mongoose.Promise = global.Promise // Use native promise (avoid DeprecationWarning with mongoose default promise library)
mongoose.connect(config.db); // conectar a base de datos mongoDB
//mongoose.connect(config.db, {useMongoClient: true, promiseLibrary: global.Promise}); // conectar a base de datos mongoDB

// permite obtener datos de los parámetros del cuerpo/body (POST)
// también permite poblar req.body correctamente (http://expressjs.com/en/api.html#req.body)
app.use(bodyParser.json()); // parse application/json 
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json como json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

app.use(methodOverride('X-HTTP-Method-Override')); // sobreescribe con el encabezado X-HTTP-Method-Override en petición. Simula DELETE/PUT
app.use(express.static(__dirname + '/public')); // establece ubicación de archivos estáticos. /public/img será /img para los usuarios

// configurar la aplicación para manejar peticiones CORS (Cross-origin resource sharing requests)
app.use(function(req, res, next){
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
	next();
});

// RUTAS ===================================================
var autentificacion = require('./app/api/authentication'); // API para autentificación
app.use('/api/', autentificacion); // usar el API desde la ruta "/api/authenticate"
var usuarios = require('./app/api/usuarios'); // API para Usuarios de la base de datos
app.use('/api/usuarios', usuarios); // usar el API desde la ruta "/api/usuarios"
var conjuntoDocumental = require('./app/api/conjuntoDocumental');
app.use('/api/conjuntoDocumental', conjuntoDocumental);
var unidadDocumental = require('./app/api/unidadDocumental');
app.use('/api/unidadDocumental', unidadDocumental);
var file = require('./app/api/file');
app.use('/api/file', file);

// log de todas las peticiones (request) en consola
app.use(morgan('dev'));

app.get('*', function(req, res) {
	var options = {
		root: __dirname
	};
    res.sendFile('/public/angular/views/index.html', options); // cargar el archivo index.html
});

// INICIAR APP =============================================
app.listen(port);
exports = module.exports = app; // exponer app
console.log('Servidor inicializado en el puerto ' + port);