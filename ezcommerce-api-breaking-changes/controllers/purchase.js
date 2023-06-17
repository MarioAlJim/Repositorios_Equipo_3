const purchaseDao = require("../dataaccess/purchase-dao.js");
const userDao = require("../dataaccess/user-dao.js");
const paymentDao = require("../dataaccess/payment-dao.js");
const productDao = require("../dataaccess/product-dao.js");
const log = require("../utils/log.js");
const messages = require("../localization/lang/en.js");

const registerPurchase = async (request, response) => {
    let username = request.params.personId;
    let person = await userDao.getPersonByUsername(username);
    let personId = person.id;
    const { quantity, paymentMethodId, productId } = request.body;
    log.debug(`Registering purchase for personId: ${personId}, quantity: ${quantity}, paymentMethodId: ${paymentMethodId}, productId: ${productId}`);
    if (isNaN(personId) || personId < 0) {
        response.status(400).json({ message: messages.strings.PERSON_INVALID_PERSONID });
    } else if (typeof paymentMethodId !== "number") {
        response.status(400).json({ message: messages.strings.PAYMENT_METHOD_INVALID_PAYMENT_METHODID });
    } else if (typeof productId !== "number" || productId < 0) {
        response.status(400).json({ message: messages.strings.PRODUCT_INVALID_PRODUCTID });
    } else if (typeof quantity !== "number" || quantity < 1 || quantity > 99) {
        response.status(400).json({ message: messages.strings.PURCHASE_INVALID_QUANTITY });
    } else {
        try {
            if (!await userDao.userExistsByPersonId(personId)) {
                response.status(404).json({ message: messages.strings.USER_NOT_FOUND });
            } else if (await paymentDao.getPaymentMethodById(paymentMethodId) == null) {
                response.status(404).json({ message: messages.strings.PAYMENT_METHOD_NOT_FOUND });
            } else if (await productDao.consultProductsById(productId) == null) {
                response.status(404).json({ message: messages.strings.PRODUCT_NOT_FOUND });
            } else if(!await productDao.enoughStock(productId, quantity)) {
                response.status(400).json({ message: messages.strings.PRODUCT_NOT_ENOUGH_STOCK });
            } else {
                let totalCost = await productDao.sellProduct(productId, quantity);
    
                let newPurchase = await purchaseDao.registerPurchase(
                    personId,
                    paymentMethodId,
                    quantity,
                    totalCost,
                    productId
                );
    
                response.status(200).json({ message: messages.strings.PURCHASE_POST });
            }
        } catch (err) {
            log.debug(`Failed to register purchase: ${err.message}`);
            response.status(500).json({ message: messages.strings.INTERAL_SERVER_ERROR });
        }
    }
};

const consultAllPurchases = async (request, response) => {
    try {
        let purchasesFound = await purchaseDao.consultAllPurchases();
        purchasesFound = await Promise.all(purchasesFound.map(async (purchase) => {
            let person =  await userDao.getPersonById(purchase.personId);
            return await {
                id: purchase.id,
                date: purchase.date,
                quantity: purchase.quantity,
                total: purchase.totalCost,
                personId: purchase.personId,
                personName: purchase.personName = person.name + " " + person.paternalSurname + " " + person.maternalSurname,
                paymentMethodId: purchase.paymentMethodId,
                productId: purchase.productId
            };
        }));

        response.status(200).json(purchasesFound);
    } catch (err) {
        log.debug(`Failed to find purchases: ${err.message}`);
        response.status(500).json({ message: messages.strings.INTERAL_SERVER_ERROR });
    }
};

const consultUserPurchases = async (request, response) => {
    let personId = request.params.personId;
    if (isNaN(personId)) {
        response.status(400).json({ message: messages.strings.PERSON_INVALID_PERSONID });
    } else {
        try {
            const purchasesFound = await purchaseDao.consultUserPurchases(personId);
            response.status(200).json({ purchasesFound });
        } catch (err) {
            log.debug(`Failed to find person purchases: ${err.message}`);
            response.status(500).json({ message: messages.strings.INTERAL_SERVER_ERROR });
        }
    }
};

const deletePurchase = async (request, response) => {
    let purchaseId = request.params.purchaseId;
    if (isNaN(purchaseId)) {
        response.status(400).json({ message: messages.strings.PURCHASE_INVALID_PURCHASEID });
    } else {
        try {
            if(await purchaseDao.purchaseExists(purchaseId)) {
                response.status(404).json({ message: messages.strings.PURCHASE_NOT_FOUND });
            } else {
               await purchaseDao.deletePurchase(purchaseId);
               response.status(200).json({ message: messages.strings.PURCHASE_DELETE });
           }
       } catch (err) {
           log.debug(`Failed to delete purchase: ${err.message}`);
           response.status(500).json({ message: messages.strings.INTERAL_SERVER_ERROR });
       }
    }
};

module.exports = {
    registerPurchase,
    deletePurchase,
    consultUserPurchases,
    consultAllPurchases,
};