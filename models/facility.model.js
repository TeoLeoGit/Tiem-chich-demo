const db = require('../database');

module.exports  = {
    async getAllFacilities() {
        let driver = db.graphDriver();
        var session = driver.session();
        var query   = "MATCH (f:Facility) RETURN f";

        return await session.run(query)
    }
}