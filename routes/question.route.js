const express = require('express');
const controller = require('../controllers/question.controller');
const router = express.Router();

router.post('/answer', controller.answerQuestion);
router.get('/search', controller.getQuestionsByTopic);
router.get('/', controller.getQuestions);
router.post('/add', controller.addQuestion)

module.exports = router;