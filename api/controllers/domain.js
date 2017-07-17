'use strict';

var neo4j = require('neo4j-driver').v1;
var _ = require('lodash');
var driver = require("../../config/db.js");
var randomip = require('random-ip');
var faker = require('faker');

module.exports = {getAllNodes, removeNode, addNode };

function addNode(req, res, next) {
    LoadData(req, res);
}

function removeNode(req, res, next) {
    FindNode(req, res);
}


function FindNode(req, res)
{
console.log("1");
  var session = driver.session();
const deletePromise = session.run(
  'MATCH (n) return n.name limit 1 '

);

deletePromise.then(result => {
    session.close();  
    DeleteNode(req, res, result);
})
.catch(error => {HandleError(req, res, error);});

}

function DeleteNode(req, res, theNode)
{
    console.log("2");
  var session = driver.session();
const deletePromise = session.run(
  "MATCH (n {name: '" + theNode + "'}) DETACH DELETE n "

);

deletePromise.then(result => {
    session.close();  
    res.json({success: 1, description: "Successfully Deleted"});

})
.catch(error => {HandleError(req, res, error);});

}




var GetNodes = function (domain, depth, callback)
{
    var session = driver.session();
    
    const findPromise =  session.run(
      'MATCH (p:Sites )<-[:RELATE*0..' + depth + ']-(a:Sites {name: $name}) RETURN a.name as name, collect(p.name) AS rel ',
      {name: domain}
    
    );
    
    findPromise.then(results => {
      session.close();
      driver.close();
    
    var nodes = [], rels = [], i = 0;
          results.records.forEach(resu => {
            
            nodes.push({title: resu.get('name'), label: 'name', weight: 1});
            var target = i;
            i++;
    
            resu.get('rel').forEach(name => {
              var actor = {title: name, label: 'actor', weight: 1};
              var source = _.findIndex(nodes, actor);
              if (source == -1) {
                nodes.push(actor);
                source = i;
                i++;
              }
              rels.push({source, target, weight: 1})
            })
          });
          console.log("3");
          callback({nodes, links: rels});  
      
    
    }).catch( reason => {
        console.log(reason);
      retun(reason); // Error!
    } );



}

function CompareJson(domain, theJson)
{
    GetNodes(domain, depth, function(val) {
        
      });

    
        
}
//GET /api/{domain}/{depth} operationId
function getAllNodes(req, res, next) {
    var domain = req.swagger.params.domain.value; //req.swagger contains the path parameters
    var depth = req.swagger.params.depth.value; //req.swagger contains the path parameters
    

    GetNodes(domain, depth, function(val) {
        res.json(val);  
      });
      

}


function LoadData(req, res)
{
    console.log("3");
var theInput = "[";

for(var i = 0; i < 1; i++)
{

  var randomDomain = faker.internet.domainName();
  var tempIp =  randomip('10.0.0.0', 8) ;

  if(i > 0 )
    {
      theInput += ",";
    }

 theInput += '{name: "' + randomDomain +'", ip: "' + tempIp + '"}' ;


}

theInput += "]";

let session1 = driver.session();

const resultPromise = session1.run(
  'UNWIND ' + theInput + ' AS i CREATE (:Sites {name: i.name, ip: i.ip})'

);

resultPromise.then(result => {
  session1.close();
  AddRelations(randomDomain, req, res);
})
.catch(error => {HandleError(req, res, error);});

} 

function RefreshSocket(domain, depth)
{
    console.log(domain);
    GetNodes(domain, depth, function(val) {
        var nodes = val.nodes;
        global.io.emit("refresh", nodes);
      });



}


function AddRelations(domain, req, res)
{

    console.log(domain);
let session2 = driver.session();

const resultPromise = session2.run(
  "match (u:Sites {name: '" + domain + "'}),(p:Sites) with u,p limit 3 where rand() < 0.8 and u <> p create (u)-[:RELATE]->(p);"

);

resultPromise.then(result => {
  session2.close();
driver.close();
res.json({success: 1, description: "Successfully Added"});
RefreshSocket(domain, 2);
})
.catch(error => {HandleError(req, res, error);});
}

function HandleError(req, res, err)      
{
    console.log("In Error");
    console.log(err);
    res.status(204);
    //res.s.json({message: "Error"});
}