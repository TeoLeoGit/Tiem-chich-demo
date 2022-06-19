const db = require('../database');

module.exports  = {
    async findCustomer(personName, personPhone) {
        let driver = db.graphDriver();
        var session = driver.session();
        var query   = "MATCH (c:Customer {name: $name, phone: $phone}) RETURN c";

        session.run(query, { name: personName, phone: personPhone })
            .then(function(result) {
                    result.records.forEach(function(record) {
                    console.log(record._fields);
                });
                    
                    return result.records;
                })
                .catch(function(error) {
                    console.log(error);
                });
    },

    async getCustomerById(id) {
        let driver = db.graphDriver();
        var session = driver.session();
        var query   = "MATCH (c:Customer {id: $id}) RETURN c";

        session.run(query, { id: id })
            .then(function(result) {
                    result.records.forEach(function(record) {
                    console.log(record._fields);
                });
                    
                    return result.records;
                })
                .catch(function(error) {
                    console.log(error);
                });
    },

    async addCustomer(name, phone) {
        let driver = db.graphDriver();
        var session = driver.session();
        var query   = "CREATE (c:Customer {name: $name, phone: $phone, id: randomUUID()}) RETURN c";

        session.run(query, { name: name, phone: phone })
            .then(function(result) {
                    console.log(result);
                    session.close();
                    driver.close();
                    return result;
                })
                .catch(function(error) {
                    console.log(error);
                    driver.close();
                });
    }
}