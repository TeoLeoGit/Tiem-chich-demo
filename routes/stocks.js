const express = require('express');
const path = require('path');
const controller = require('../controllers/product.controller');
const router = express.Router();


// router.get('/insertSample', controller.insertSample);
router.get('/detail', controller.getProductDetail);
// router.post('/add', upload.single('img'), controller.addProduct);
// router.post('/detail',  upload.single('img'), controller.updateProduct);
router.post('/delete', controller.deleteProduct);
router.get('/search/:page', controller.getProductsByName);
router.get('/search', controller.getProductsByName);
router.get('/:page', controller.getProducts);
router.get('/', controller.getProducts);




module.exports = router;
