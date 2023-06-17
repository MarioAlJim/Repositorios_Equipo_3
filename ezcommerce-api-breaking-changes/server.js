const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger.json');
const cors = require('./middlewares/cors.js');
const log = require('./utils/log.js');
const morganMiddleware = require('./middlewares/morgan.js');

class Server {
    constructor() {
        this.log = log;
        this.app = express();
        this.port = process.env.PORT || 3000;
        this._initMiddlewares();
        this._initRoutes();
        this._initSwagger();
    }

    _initMiddlewares() {
        //this.app.use(cors);
        this.app.use(express.json());
        this.app.use(express.static('html'));
        this.app.use(morganMiddleware);
    }

    _initRoutes() {
        this.app.use('/test', require('./routes/test.js'));
        this.app.use('/api/auth', require('./routes/auth.js'));
        this.app.use('/api/users', require('./routes/users.js'));
        this.app.use('/api/products', require('./routes/product.js'));
        this.app.use('/api/brands', require('./routes/brand.js'));
        this.app.use('/api/categories', require('./routes/category.js'));

        this.app.use('/api/purchases', require('./routes/purchase.js'));
        this.app.use('/api/refund', require('./routes/refund.js'));
    }

    _initSwagger() {
        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    }

    start() {
        this.app.listen(this.port, () => {
            this.log.info(`Server listening on port ${this.port}`);
        });
    }
}

module.exports = Server;
