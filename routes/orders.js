const express = require('express');
const router = express.Router();
const controller = require('../controllers/order.controller');

router.get('/', controller.getNewOrder);
router.get('/:page', controller.getNewOrder);
router.post('/receive', controller.receiveOrder);
router.post('/decline', controller.declineOrder);
module.exports = router;
