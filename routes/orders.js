const express = require('express');
const router = express.Router();
const controller = require('../controllers/order.controller');

router.get('/:page', controller.getNewOrders);
router.post('/add', controller.createOrder);
//router.post('/receive', controller.receiveOrder);
router.post('/reject', controller.declineOrder);
router.get('/', controller.getNewOrders);
module.exports = router;
