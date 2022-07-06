const db = require('../database');
const neo4j = require('neo4j-driver');

module.exports  = {
    async findAppointmentsOfCustomer(id, options) {
        let driver = db.graphDriver();
        var session = driver.session();
        var query   = "MATCH (Customer {id: $id})-[r: HAVE_APPOINTMENT]->(f: Facility) RETURN r, f.name ORDER BY r.id SKIP $skip LIMIT $limit;";

        return await session.run(query, { id: id, skip:  neo4j.int(options.skip), limit: neo4j.int(options.limit) })
    },


    async addAppointmentForOrder(appointment) {
        //console.log(appointment)
        let driver = db.graphDriver();
        var session = driver.session();
        var query   = "MATCH (a:Customer), (b:Facility) WHERE a.id = $customerId AND b.name = $facility" +
            " CREATE (a)-[r:HAVE_APPOINTMENT {id: randomUUID(), orderId: $orderId, vaccines: $vaccines, date: $date, status: 'Scheduled'}]->(b) RETURN r;";
        
        return await session.run(query, {customerId: appointment.customerId, 
            facility: appointment.facility, 
            orderId: appointment.orderId, 
            vaccines: appointment.vaccines, 
            date: appointment.date })
    },

    async addAppointmentForSignup(appointment) {
        let driver = db.graphDriver();
        var session = driver.session();
        var query   = "MATCH (a:Customer), (b:Facility) WHERE a.id = $customerId AND b.name = $facility" +
            " CREATE (a)-[r:HAVE_APPOINTMENT {id: randomUUID(), signupId: $signupId, vaccines: $vaccines, date: $date, status: 'Scheduled'}]->(b) RETURN r;";
        
        return await session.run(query, {customerId: appointment.customerId, 
            facility: appointment.facility, 
            signupId: appointment.signupId, 
            vaccines: appointment.vaccines, 
            date: appointment.date })
    }
}