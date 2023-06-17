const { Sequelize } = require('sequelize');
const SQLite = require('sqlite3');

let sequelize = new Sequelize('ezcommerce', process.env.DB_USER, process.env.DB_PASS, {
    dialect: 'sqlite',
    storage: 'data/db.sqlite',
    dialectOptions: {
        mode: SQLite.OPEN_READWRITE | SQLite.OPEN_CREATE
    },
    logging: false
});

const person = require('./person.js')(sequelize);
const user = require('./user.js')(sequelize);
const brand = require('./brand.js')(sequelize);
const category = require('./category.js')(sequelize);
const product = require('./product.js')(sequelize);
const paymentMethod = require('./paymentMethod.js')(sequelize);
const purchase = require('./purchase.js')(sequelize);
const refund = require('./refund.js')(sequelize);

module.exports = { 
    sequelize,
    person,
    user,
    brand,
    category,
    product,
    paymentMethod,
    purchase,
    refund
};
