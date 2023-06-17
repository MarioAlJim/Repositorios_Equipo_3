const { Router } = require('express')
const refundController = require('../controllers/refund.js');

const router = Router();
router.get('/', refundController.getAllRefundRequests);
router.post('/:purchaseId', refundController.requestRefund);
router.put('/:requestId', refundController.setRefundStatus);

module.exports = router;