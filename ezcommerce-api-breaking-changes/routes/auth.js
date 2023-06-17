const { Router } = require('express')
const authController = require('../controllers/auth.js');

const router = Router();
router.post('/employee/:username', authController.loginEmployee);
router.post('/customer/:username', authController.loginCustomer);

module.exports = router;
