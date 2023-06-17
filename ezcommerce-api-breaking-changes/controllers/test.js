const log = require('../utils/log.js');

const testGet = (req, res) => {
    res.send('Hello World!');
    log.debug('Called testGet');
}

module.exports = {
    testGet
}
