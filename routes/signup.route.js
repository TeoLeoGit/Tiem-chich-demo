const express = require('express');
const router = express.Router();
const controller = require('../controllers/signup.controller');

router.get('/:page', controller.getNewSignups);
router.post('/add', controller.createSignup);
router.post('/receive', controller.receiveSignup);
router.post('/reject', controller.declineSignup);
router.get('/', controller.getNewSignups);
module.exports = router;
