var jwt = require('jsonwebtoken'); // manejo de autentificación por JSON Web Token
var secret = require('../../config').jwt;

module.exports = function(req, res, next){
    var token = req.body.token || req.params.token || req.headers['x-access-token'];

    //decodificar token
    if(token){
        // verifica con secret y checa expiración
        jwt.verify(token, secret, function(err, decoded){
            if(err){
                if(err.name === 'TokenExpiredError'){
                    return res.status(403).send({
                        success: false,
                        message: 'JWT expirado',
                        error: err
                    });
                }
                return res.status(403).send({
                    success: false,
                    message: 'Error en autentificación de token',
                    error: err
                });
            }
            else{
                // si todo está bien, guardar a petición (request) para usar en otras rutas
                req.decoded = decoded;
                //console.log('req.decoded: ', req.decoded);

                next(); // Pasar el control de las rutas a la siguiente coincidencia
            }
        });
    }
    else{
        // si no hay token
        // devolver respuesta HTTP 403 (acceso prohibido) y un mensaje de error
        return res.status(403).send({
            success: false,
            message: 'No hay token'
        });
    }
}
