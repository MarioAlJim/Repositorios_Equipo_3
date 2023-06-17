const { Router } = require('express')
const purchaseController = require('../controllers/purchase.js');
const authMiddleware = require('../middlewares/auth.js');

const router = Router();
router.use(authMiddleware.verifyCustomerAuthToken);
router.post('/:personId', purchaseController.registerPurchase);
router.get('/', purchaseController.consultAllPurchases);
router.get('/:personId', purchaseController.consultUserPurchases);
router.delete('/:purchaseId', purchaseController.deletePurchase);

module.exports = router;