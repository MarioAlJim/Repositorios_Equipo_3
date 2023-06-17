const { Router } = require('express')
const productController = require('../controllers/product.js');
const authMiddleware = require('../middlewares/auth.js');

const router = Router();
router.use(authMiddleware.verifyCustomerAuthToken);

router.get('/', productController.consultAllProducts);
router.get('/:id', productController.getProduct);
router.post('/', productController.registerProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
