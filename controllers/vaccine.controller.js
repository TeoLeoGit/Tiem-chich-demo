const Vaccine = require('../models/vaccine.model');
const {mongooseToObject} = require('../utils/mongooseUtil');


class VaccineController {
    getVaccineDetail(req, res, next) {
        Vaccine.getVaccineById(req.query)
            .then(vaccine => {
                res.render('vaccineDetail', mongooseToObject(vaccine))
            })
            .catch(next);
    }

    async getVaccines(req, res, next) {
        let options = {
            page: 1,
            limit: 10,
        };

        let filter = { activeFlag: 1}
        if(req.params.page) options['page'] = parseInt(req.params.page)
        await Vaccine.loadWithPagination(filter, options)
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
                                    
                res.render('vaccines', {
                    vaccines: result.docs,
                    page: pages,
                    hasPrev: hasPrev,
                    hasNext: hasNext,
                    prevAndNext: prevAndNext,
                    prevAndNextInPages: prevAndNextInPages
                })
            })
            .catch(next);     
    }

    async getVaccinesByName(req, res, next) {
        // console.log(req.query.name)
        let options = {
            page: 1,
            limit: 10,
        };
        let filter = { activeFlag: 1}
        if (req.query.name)
            filter['name'] = { $regex: '.*' + req.query.name + '.*'}
        if(req.params.page) options['page'] = parseInt(req.params.page)

        
        await Vaccine.loadWithPagination(filter, options)
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
                                    
                res.render('vaccines', {
                    vaccines: result.docs,
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

}

module.exports = new VaccineController();