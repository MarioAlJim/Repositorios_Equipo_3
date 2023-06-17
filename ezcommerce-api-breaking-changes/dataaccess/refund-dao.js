const { refund } = require('../models');
const log = require('../utils/log.js');

const requestRefund = async (reason, purchaseId) => {
    let currentDate = new Date();
    let year = currentDate.getFullYear();
    let month = currentDate.getMonth() + 1; // Los meses en JavaScript se indexan desde 0
    let day = currentDate.getDate();
    let hours = currentDate.getHours();
    let minutes = currentDate.getMinutes();
    let seconds = currentDate.getSeconds();
    let milliseconds = currentDate.getMilliseconds();
    
    // Formateo de la fecha y hora en formato SQLite
    let requestDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;

    try {
        let newRequest = await refund.create({
            status: 0,
            reason,
            purchaseId,
            requestDate
        });

        refund.sync();
        return newRequest;
    }
    catch(error) {
        log.debug(`Failed to request refund: ${error.message}`);
        throw new Error(error.message);
    }
}

const getRefundById = async (id) => {
    try {
        let targetRefund = await refund.findOne({
            where: {
                id
            }
        });

        return targetRefund;
    }
    catch(error) {
        log.debug(`Failed to get refund: ${error.message}`);
        throw new Error(error.message);
    }
}

const refundExists = async (id) => {
    try {
        let targetRefund = await getRefundById(id);

        return targetRefund !== null;
    }
    catch(error) {
        log.debug(`Failed to get refund: ${error.message}`);
        throw new Error(error.message);
    }
}

const refundExistsByPurchase = async (purchaseId) => {
    try {
        let targetRefund = await refund.findOne({
            where: {
                purchaseId: purchaseId
            }
        });

        return targetRefund !== null;
    }
    catch(error) {
        log.debug(`Failed to get refund: ${error.message}`);
        throw new Error(error.message);
    }
}

const setRefundStatus = async (id, status) => {
    try {
        let targetRefund = await getRefundById(id);

        if(targetRefund !== null) {
            let affectedRows = await targetRefund.update({
                status
            });

            await targetRefund.save();
            return affectedRows !== 0;
        }

        return false;
    }
    catch(error) {
        log.debug(`Failed to set status: ${error.message}`);
        throw new Error(error.message);
    }
}

const getAllRefundRequests = async() => {
    try {
        let refundRequests = await refund.findAll();
        return refundRequests;
    }
    catch(error) {
        log.debug(`Failed to get refund requests: ${error.message}`);
        throw new Error(error.message);
    }
}

module.exports = {
    requestRefund,
    refundExists,
    refundExistsByPurchase,
    setRefundStatus,
    getAllRefundRequests
}