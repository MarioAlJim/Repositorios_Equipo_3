const dotenv = require('dotenv');
const Server = require('./server');

dotenv.config();

const server = new Server();
server.start();
