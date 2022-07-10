const Vaccine = require('../models/vaccine.model');
const Facility = require('../models/facility.model');
const {mongooseToObject} = require('../utils/mongooseUtil');


class VaccineController {
    getVaccineDetail(req, res, next) {
        console.log(req.query)
        Vaccine.getVaccineById(req.query)
            .then(vaccine => {
                res.render('vaccineDetails', mongooseToObject(vaccine))
            })
            .catch(next);
    }

    async getVaccines(req, res, next) {
        if(req.isAuthenticated()) res.redirect('/orders') 
        else {
            let options = {
                page: 1,
                limit: 10,
            };
            
            let model = await Facility.getAllFacilities();
                let facilities = []
                model.records.forEach(function(record) {
                        facilities.push(record._fields[0])
                    });

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
                        prevAndNextInPages: prevAndNextInPages,
                        facilities: facilities
                    })
                })
                .catch(next);     
        }
    }

    async getVaccinesByName(req, res, next) {
        let options = {
            page: 1,
            limit: 10,
        };
        let filter = { activeFlag: 1}
        if (req.query.name)
            filter['name'] = { $regex: '.*' + req.query.name + '.*'}
        if (req.query.category)
            filter.category = req.query.category
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