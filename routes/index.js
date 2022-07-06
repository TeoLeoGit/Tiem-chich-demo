const express = require('express');
const router = express.Router();
const controller = require('../controllers/vaccine.controller');

router.get('/', controller.getVaccines);


module.exports = router;
