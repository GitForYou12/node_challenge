 var neo4j = require('neo4j-driver').v1;
 var randomip = require('random-ip');
 var faker = require('faker');
 var numberOfLoads = 0;
 var driver = require("./config/db.js");


var session = driver.session();

const deletePromise = session.run(
  'MATCH (n) OPTIONAL MATCH (n)-[r]-() DELETE n,r'

);

deletePromise.then(result => {
    session.close();  
    LoadData();
}).catch(error => {HandleError(error);});





function LoadData()
{
var theInput = "[";



for(var i = 0; i < 10000; i++)
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
  if(numberOfLoads < 10)
    {
      numberOfLoads++;
      LoadData();
    }
    else{
  AddRelations();
    }

  
}).catch(error => {HandleError(error);});

} 


function AddRelations()
{

let session2 = driver.session();


const resultPromise = session2.run(
  'match (u:Sites),(p:Sites) with u,p limit 500000 where rand() < 0.001 and u <> p create (u)-[:RELATE]->(p);'

);

resultPromise.then(result => {
  session2.close();
driver.close();
process.exit();  
}).catch(error => {HandleError(error);});

}


function HandleError(err)      
{
    console.log(err);
    process.exit(1);
}