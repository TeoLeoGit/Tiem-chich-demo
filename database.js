//Mongodb
const mongoose = require('mongoose');
//Neo4j
const neo4j = require('neo4j-driver');

var driver;

module.exports = {
    connectMongoDB(url) {
        mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
            .then((result => console.log('Connected successfully to server')))
            .catch((error) => console.log(error))
    },

    connectNeo4j(uri, pw) {
        driver = neo4j.driver(uri, neo4j.auth.basic("neo4j", pw));;
    },

    graphDriver() {
        return driver;
    }
}