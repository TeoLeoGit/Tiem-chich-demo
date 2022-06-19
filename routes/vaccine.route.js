const express = require('express');
const controller = require('../controllers/vaccine.controller');
const router = express.Router();

router.get('/search', controller.getVaccinesByName);
router.get('/search/:page', controller.getVaccinesByName);
router.get('/:page', controller.getVaccines);
router.get('/', controller.getVaccines);

module.exports = router;
