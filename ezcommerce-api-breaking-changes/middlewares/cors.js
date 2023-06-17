const cors = require('cors');
const log = require('../utils/log.js');

var allowedOrigins = ['http://localhost:8080', 'http://ezc.vadam.xyz', 'https://ezc.vadam.xyz'];

module.exports = cors({
    origin: function (origin, callback) {
        log.debug(`[cors] ${origin}`);
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true)
        } 
        else {
            callback(null, false)
        }
    }
});
