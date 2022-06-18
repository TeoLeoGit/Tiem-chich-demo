const express = require('express');
const router = express.Router();
const path = require('path');
const multer  = require('multer');
//upload image to public/images
const upload = multer({ dest: path.join(path.dirname(__dirname), '/public/images') })
const controller = require('../controllers/admin.controller');


//admin profile
router.get('/', function(req, res, next) {
  if(req.isAuthenticated()) {
    res.render('adminProfile/adminProfile', { title: 'Express' });
  }
  else   
      res.redirect('/login')
});

//update profile
router.post('/update', upload.single('img'), controller.updateAdmin);

module.exports = router;
