const express = require('express');
const controller = require('../controllers/appointment.controller');
const router = express.Router();


router.get('/search', controller.findAppointments);
router.get('/createForOrder', controller.appointmentForOrderSite);
router.get('/createForSignup', controller.appointmentForSignupSite);
router.post('/createForOrder', controller.createAppointmentForOrder);
router.post('/createForSignup', controller.createAppointmentForSignup);
router.get('/', controller.index);
module.exports = router;