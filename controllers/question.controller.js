const Question = require('../models/question.model');
const {mongooseToObject} = require('../utils/mongooseUtil');


class QuestionController {
    async getQuestions(req, res, next) {
        let options = {
            page: 1,
            limit: 10,
        };

        let filter = { activeFlag: 1}
        if(req.params.page) options['page'] = parseInt(req.params.page)
        await Question.loadWithPagination(filter, options)
            .then(result => {
                let pages = []
                let currentPage = result.page;
                let totalPages = result.totalPages;
                pages.push({page: currentPage})
                for (let i = currentPage + 1; i < currentPage + 5; i++)
                    if(i <= totalPages)
                        pages.push({page: i})
                
                let hasPrev = true
                if (currentPage == 1) hasPrev = false
                let hasNext = true
                if( pages[pages.length - 1].page == totalPages) hasNext = false;

                let prevAndNextInPages = { prev: currentPage - 1, next: pages[pages.length - 1].page + 1}
                let prevAndNext = { prev: currentPage - 1, next: currentPage + 1}
                
                res.render('questions', {
                    questions: result.docs,
                    page: pages,
                    hasPrev: hasPrev,
                    hasNext: hasNext,
                    prevAndNext: prevAndNext,
                    prevAndNextInPages: prevAndNextInPages
                })
            })
            .catch(next);     
    }

    async getQuestionsByTopic(req, res, next) {
        // console.log(req.query.name)
        let options = {
            page: 1,
            limit: 10,
        };
        let filter = { activeFlag: 1}
        if (req.query.subject)
            filter['subject'] = { $regex: '.*' + req.query.subject + '.*'}
        if(req.params.page) options['page'] = parseInt(req.params.page)

        await Question.loadWithPagination(filter, options)
            .then(result => {
                let pages = []
                let currentPage = result.page;
                let totalPages = result.totalPages;
                pages.push({page: currentPage})
                for (let i = currentPage + 1; i < currentPage + 5; i++)
                    if(i <= totalPages)
                        pages.push({page: i})
                
                //console.log(pages)
                let hasPrev = true
                if (currentPage == 1) hasPrev = false
                let hasNext = true
                if( pages[pages.length - 1].page == totalPages) hasNext = false;

                let prevAndNextInPages = { prev: currentPage - 1, next: pages[pages.length - 1].page + 1}
                let prevAndNext = { prev: currentPage - 1, next: currentPage + 1}
                let subRoute = '/search'
                                    
                res.render('questions', {
                    questions: result.docs,
                    page: pages,
                    hasPrev: hasPrev,
                    hasNext: hasNext,
                    prevAndNext: prevAndNext,
                    prevAndNextInPages: prevAndNextInPages,
                    subRoute: subRoute
                })
            })
            .catch(next);  
    }

    async addQuestion(req, res, next) {
        let question = {}
        question.poster = req.body.poster
        question.phone = req.body.phone
        if(req.body.email) question.email = req.body.email
        question.gender = req.body.gender
        question.age = parseInt(req.body.age)
        question.address = req.body.address
        question.comment = req.body.comment
        question.subject = req.body.subject

        await Question.addQuestion(question)
                .then(result => {
                    res.redirect('/questions');
                })
                .catch(next);  
    }

    async answerQuestion(req, res, next) {
        if(req.isAuthenticated()) {
            let update = { answer: {} }
            if(req.body.answer) update.answer.comment = req.body.answer
            update.answer.employee = res.locals.user.name
            await Question.updateQuesitonById({_id: req.body._id}, update)
                .then(result => {
                    res.redirect('/questions')
                })
                .catch(next);
        }
        else   
            res.redirect('/login')
    }
}

module.exports = new QuestionController();