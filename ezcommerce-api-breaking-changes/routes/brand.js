const { Router } = require('express')
const brandController = require('../controllers/brand.js');
const authMiddleware = require('../middlewares/auth.js');

const router = Router();
router.use(authMiddleware.verifyCustomerAuthToken);
router.post('/:name', brandController.registerBrand);
router.get('/', brandController.consultAllBrands);
router.put('/:brand', brandController.updateBrand);
router.get('/:id', brandController.getBrand);

module.exports = router;
