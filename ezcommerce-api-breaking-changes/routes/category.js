const { Router } = require('express')
const categoryController = require('../controllers/category.js');
const authMiddleware = require('../middlewares/auth.js');

const router = Router();
router.use(authMiddleware.verifyCustomerAuthToken);
router.get('/', categoryController.consultAllCategories);
router.post('/', categoryController.registerCategory);
router.get('/:id', categoryController.getCategory);

module.exports = router;