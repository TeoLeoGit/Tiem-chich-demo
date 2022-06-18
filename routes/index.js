const express = require('express');
const router = express.Router();
const controller = require('../controllers/analytic.controller');

router.get('/', controller.getAnalytics);


module.exports = router;
