const { config } = require('../config');

function cacheResponse(res, seconds) {
    // Si no estamos en modo desarrollo
    if (!config.dev) {    
        /**
         * Agregamos al Header de la peticion HTTP, para poder agregar cache a las rutas que necesitemos (que esemos solicitando recursos), 
         * por ejemplo, al obtener la lista de las movies se tardarian, por lo que seria meejor guardarlas en cache
         */
        res.set('Cache-Control', `public, max-age=${seconds}`);
    }
}

module.exports = cacheResponse;
