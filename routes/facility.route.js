const express = require('express');
const controller = require('../controllers/facility.controller');
const router = express.Router();

router.get('/', controller.getAllFacilities);

module.exports = router;