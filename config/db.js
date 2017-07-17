
neo4j = require('neo4j-driver').v1;

module.exports = neo4j.driver("bolt://52.87.220.140:33867", neo4j.auth.basic("testnode", "testnode"));