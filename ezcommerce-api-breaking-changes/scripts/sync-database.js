const log = require('../utils/log.js');
const { copyFileSync, existsSync } = require('fs');
const { sequelize, brand, user, person, purchase, product, paymentMethod, refund } = require('../models');
const { calculateSHA256Hash } = require("../utils/auth.js");
const refundDao = require("../dataaccess/refund-dao.js");
const userDao = require("../dataaccess/user-dao.js");

async function initializeDatabase(forceSync) {
    try {
        await sequelize.sync({ force: forceSync });
        log.info('Database initialized!');
    }
    catch(err) {
        log.error('Failed to initialize database.');
        log.debug(err.message);
    }
}

async function setUpAdmin() {
    let otp = "000000";
    log.info('Setting up admin user...');
    try {
        await userDao.createUser(
            "Admin",
            "admin",
            "admin",
            "2002-04-01",
            "admin@gmail.com",
            "9671231231",
            "Admin",
            await calculateSHA256Hash("#Admin01"),
            otp,
            2
        );

        await userDao.activateUser("Admin", otp);

        person.sync();
        user.sync();
    }
    catch(err) {
        log.error('Failed to set up admin user.');
        log.debug(err.message);
    }
}

async function setUpUsers() {
    let otp = "000000";
    log.info('Setting up Mario\'s user...');
    try {
        await userDao.createUser(
            "Mario",
            "Jimenez",
            "Jimenez",
            "2002-04-01",
            "majiji@gmail.com",
            "9671231231",
            "Majiji",
            await calculateSHA256Hash("#Majiji01"),
            otp,
            1
        );

        await userDao.activateUser("Majiji", otp);

        person.sync();
        user.sync();
    }
    catch(err) {
        log.error('Failed to set up Mario user.');
        log.debug(err.message);
    }
}

async function setUpPaymentMethods() {
    log.info('Setting up payment method 1...');

    try {
        await paymentMethod.create({
            description: "Cash payment"
        });
    }
    catch(err) {
        log.error('Failed to set up cash payment method.');
        log.debug(err.message);
    }
    
    log.info('Setting up payment method 2...');

    try {
        await paymentMethod.create({
            description: "Credit card payment"
        });
    }
    catch(err) {
        log.error('Failed to set up credit card payment method.');
        log.debug(err.message);
    }

    paymentMethod.sync();
}

async function setUpProducts() {
    log.info('Setting up product 1...');

    try {
        await product.create({
            inventory: 15,
            productModel: "TENIS NIKE COURT BOROUGH LOW 2 JOVEN",
            price: 1250,
            size: 15
        });   
    }
    catch(err) {
        log.error('Failed to set up product 1.');
        log.debug(err.message);
    }

    product.sync();
}

async function setUpPurchases() {
    log.info('Setting up purchase 1...');

    try {
        const userPurchase1 = await user.findOne({ where: { username: "Majiji" } });
        const paymentMethod1 = await paymentMethod.findOne({ where: { description: "Cash payment" }});
        const product1 = await product.findOne({ where: { productModel: "TENIS NIKE COURT BOROUGH LOW 2 JOVEN" }});

        await purchase.create({
            date: "2022-05-10",
            quantity: 3,
            total: 3750,
            personId: userPurchase1.personId,
            paymentMethodId: paymentMethod1.id,
            productId: product1.id
        });
    }
    catch(err) {
        log.error('Failed to set up purchase 1.');
        log.debug(err.message);
    }

    purchase.sync();
}

async function setUpRefunds() {
    log.info('Setting up refund 1...');

    try {
        const purchase1 = await purchase.findOne({ where: { id: 1 }})
        await refundDao.requestRefund("Los tenis venian defectuosos", purchase1.id);    
    }
    catch(err) {
        log.error('Failed to set up refund 1.');
        log.debug(err.message);
    }
    
    refund.sync();
}

async function setUpBrands() {
    log.info('Setting up brand 1...');

    try {
        await brand.create({ name: "Nike" });  
    }
    catch(err) {
        log.error('Failed to set up brand 1.');
        log.debug(err.message);
    }
    
    brand.sync();
}

async function initializeData() {
    log.info('Inserting data...');
    try {
        await setUpAdmin();
        await setUpUsers();
        await setUpBrands();
        await setUpPaymentMethods();
        await setUpProducts();
        await setUpPurchases();
        await setUpRefunds();
    }
    catch(err) {
        log.error('Failed to insert data.');
        log.debug(err.message);
    }
}

function createBackup() {
    log.warn('Creating database backup...');
    try {
        copyFileSync('data/db.sqlite', `data/db-backup-${new Date().toISOString()}.sqlite`);
    }
    catch(err) {
        log.error('Failed to create backup!');
        process.exit(1);
    }
}

// Get args
const force = process.argv.includes('--force') || process.argv.includes('-f');
const backup = process.argv.includes('--backup') || process.argv.includes('-b');

const databaseExists = existsSync('data/db.sqlite');
if(databaseExists && (force || backup)) {
    createBackup();
}

initializeDatabase(force).then(() => {
    if(!databaseExists) {
        initializeData();
    }
});