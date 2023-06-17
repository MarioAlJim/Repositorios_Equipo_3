const { Router } = require('express')
const testController = require('../controllers/test.js');

const router = Router();
router.get('/', testController.testGet);

module.exports = router;
