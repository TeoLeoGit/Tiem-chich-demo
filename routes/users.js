const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  if(req.isAuthenticated()) {
    res.send('respond with a resource');
  }
  else   
      res.redirect('/login')
});

module.exports = router;
