const express = require('express');
const router = express.Router();
const controller = require('../controllers/order.controller');

router.get('/', controller.getReceivedOrders);
router.get('/:page', controller.getReceivedOrders);

module.exports = router;
