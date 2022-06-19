const Facility = require('../models/facility.model');

class FacilityController {
    async getAllFacilities(req, res, next) {
        await Facility.getAllFacilities()
            .then(function(result) {
                let facilities = []
                result.records.forEach(function(record) {
                    facilities.push(record._fields[0])
                });
                //console.log(facilities);
                res.render('facilities', {
                    facilities: facilities
                })
            })
            .catch(next);
    }

}

module.exports = new FacilityController();