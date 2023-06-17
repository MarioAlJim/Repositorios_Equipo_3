const morgan = require("morgan");
const log = require("../utils/log.js");

module.exports = morgan(':remote-addr - :remote-user ":method :url HTTP/:http-version" :status ":user-agent"', {
    stream: {
        write: (message) => {
            message = message.replace(/\n$/, '');
            log.debug('[morgan]' + message);
        }
    },
});
