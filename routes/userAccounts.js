const express = require('express');
const router = express.Router();

const controller = require('../controllers/user.controller');

router.get('/detail', controller.getUserDetail);
router.get('/', controller.getUsers);
router.get('/:page', controller.getUsers);
router.post('/block', controller.blockUser);
router.post('/unblock', controller.unblockUser);

// router.get('/userAccountId', function(req, res, next) {
//   if(req.isAuthenticated()) {    
//     res.render('userAccounts/userDetail', { title: 'Express' });
//   }
//   else   
//       res.redirect('/login')
// });

module.exports = router;
