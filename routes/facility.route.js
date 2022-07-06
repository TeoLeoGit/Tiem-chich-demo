const express = require('express');
const controller = require('../controllers/facility.controller');
const router = express.Router();


router.post('/search', controller.findFacilities);
router.get('/', controller.getAllFacilities);

module.exports = router;