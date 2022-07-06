const db = require('../database');

module.exports  = {
    async findCustomer(personName, personPhone) {
        let driver = db.graphDriver();
        var session = driver.session();
        var query   = "MATCH (c:Customer {name: $name, phone: $phone}) RETURN c";

        return await session.run(query, { name: personName, phone: personPhone })
    },

    async getCustomerById(id) {
        let driver = db.graphDriver();
        var session = driver.session();
        var query   = "MATCH (c:Customer {id: $id}) RETURN c";

        return await session.run(query, { id: id })
    },

    async addCustomer(customer) {
        let driver = db.graphDriver();
        var session = driver.session();
        var query   = "CREATE (c:Customer { id: randomUUID(), name: $name, phone: $phone, email: $email, " + 
            "address: $address }) RETURN c";

        return await session.run(query, { name: customer.name, 
                                            phone: customer.phone,
                                            email: customer.email,
                                            address: customer.address })
    },

    async getRelationship(id1, id2) {
        let driver = db.graphDriver();
        var session = driver.session();
        var query   = "MATCH (c:Customer {id: $id1})-[r:RELATIONSHIP]->(Customer {id: $id2}) RETURN r.relationship";

        return await session.run(query, { id1: id1, id2: id2})

    },

    async createRelationship(id1, id2, relationship) {
        let driver = db.graphDriver();
        var session = driver.session();
        var query   = "MATCH (a:Customer), (b:Customer) WHERE a.id = $id1 AND b.id = $id2 " + 
                        "CREATE (a)-[r:RELATIONSHIP {relationship: $relationship}]->(b) " +
                        "RETURN r.relationship;"

        return await session.run(query, { id1: id1, 
                                            id2: id2,
                                            relationship: relationship })

    },


}