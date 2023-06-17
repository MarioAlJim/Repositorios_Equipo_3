const { Router } = require('express')
const userController = require('../controllers/user.js');
const authMiddleware = require('../middlewares/auth.js');

const router = Router();
router.get('/', authMiddleware.verifyAdminAuthToken, userController.getUsers);
router.get('/:username', authMiddleware.verifyAdminAuthToken, userController.getUser);
router.post('/:username', authMiddleware.verifyAdminAuthToken, userController.createUser);
router.put('/:username', authMiddleware.verifyAdminAuthToken, userController.updateUser);
router.delete('/:username', authMiddleware.verifyAdminAuthToken, userController.deleteUser);
router.post('/customer/:username', userController.createCustomer);
router.put('/activate/:username', userController.activateUser);

module.exports = router;
