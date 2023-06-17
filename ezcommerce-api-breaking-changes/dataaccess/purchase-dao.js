const { purchase } = require('../models');
const log = require('../utils/log.js');

const registerPurchase = async (personId, paymentMethodId, quantity, total, productId) => {
    let currentDate = new Date();
    let year = currentDate.getFullYear();
    let month = currentDate.getMonth() + 1; // Los meses en JavaScript se indexan desde 0
    let day = currentDate.getDate();
    let hours = currentDate.getHours();
    let minutes = currentDate.getMinutes();
    let seconds = currentDate.getSeconds();
    let milliseconds = currentDate.getMilliseconds();
    
    // Formateo de la fecha y hora en formato SQLite
    let date = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
    
    try {
        let newPurchase = await purchase.create({
            date,
            quantity,
            total,
            personId,
            paymentMethodId,
            productId,
        });

        purchase.sync();
    
        return newPurchase;
    }

    catch(error) {
        log.debug(`Failed to create purchase: ${error.message}`);
        throw new Error(error.message);
    }
};

const consultAllPurchases = async() => {
    try {
        const purchasesFound = await purchase.findAll();
        return purchasesFound;
    } catch(err) {
        log.debug(`Failed to find purchases: ${err.message}`);
        throw new Error(err.message);
    }
}

const consultUserPurchases = async(personId) => {
    try {
        const purchasesFound = await purchase.findAll({
            where: { personId }
        });
        return purchasesFound;
    } catch(err) {
        log.debug(`Failed to find person purchases: ${err.message}`);
        throw new Error(err.message);
    }
}

const deletePurchase = async(purchaseId) => {
    try {
        const deletedPurchase = await purchase.destroy({
            where: { id: purchaseId }
        });
        return deletedPurchase;
    } catch(err) {
        log.debug(`Failed to delete purchase: ${err.message}`);
        throw new Error(err.message);
    }
}

const purchaseExists = async (purchaseId) => {
    try {
        let targetPurchase = await purchase.findByPk(purchaseId);
    
        return targetPurchase !== null;
    }
    catch(error) {
        log.debug(`Failed to get purchase: ${error.message}`);
        throw new Error(error.message);
    }
};

module.exports = {
    registerPurchase,
    consultAllPurchases,
    deletePurchase,
    consultUserPurchases,
    purchaseExists
};

