const refundDao = require("../dataaccess/refund-dao.js");
const log = require("../utils/log.js");
const validations = require("../utils/validations.js");
const messages = require("../localization/lang/en.js");

const requestRefund = async (request, response) => {
    let purchaseId = request.params.purchaseId;
    const { reason } = request.body;

    if (!validations.validateTextAlphaNumeric(reason, 500, 20, true)) {
        response.status(400).json({ message: messages.strings.REFUND_INVALID_REASON });
    } else if (isNaN(purchaseId)) {
        response.status(400).json({ message: messages.strings.PURCHASE_INVALID_PURCHASEID });
    } else {
        try {
            if (await refundDao.refundExistsByPurchase(purchaseId)) {
                response.status(400).json({ message: messages.strings.REFUND_DUPLICATED });
            } else {
                await refundDao.requestRefund(reason, purchaseId);
                response.status(200).json({ message: messages.strings.REFUND_POST });
            }
        } catch (error) {
            log.debug(`Failed to request refund: ${error.message}`);
            response.status(500).json({ message: messages.strings.INTERAL_SERVER_ERROR });
        }
    }
};

const setRefundStatus = async (request, response) => {
    let id = request.params.requestId;
    let { status } = request.body;

    if (isNaN(id)) {
        response.status(400).json({ message: messages.strings.REFUND_INVALID_REQUESTID });
    } else if (typeof status !== "number" || status < -1 || status > 1 || status == 0) {
        response.status(400).json({ message: messages.strings.REFUND_INVALID_STATUS });
    } else {
        try {
            if (!await refundDao.refundExists(id)) {
                response.status(400).json({ message: messages.strings.REFUND_NOT_FOUND });
            } else {
                await refundDao.setRefundStatus(id, status);
                response.status(200).json({ message: messages.strings.REFUND_PUT });
            }
        } catch (error) {
            log.debug(`Failed to set refund status: ${error.message}`);
            response.status(500).json({ message: messages.strings.INTERAL_SERVER_ERROR });
        }
    }
};

const getAllRefundRequests = async (request, response) => {
    try {
        let requests = await refundDao.getAllRefundRequests();
        response.status(200).json({ requests });
    } catch (error) {
        log.debug(`Failed to get refund requests: ${error.message}`);
        response.status(500).json({ message: messages.strings.INTERAL_SERVER_ERROR });
    }
};

module.exports = {
    requestRefund,
    setRefundStatus,
    getAllRefundRequests,
};
