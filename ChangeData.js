 var randomip = require('random-ip');
 var faker = require('faker');
 var fetch = require('node-fetch');


 function DeleteRecord()
 {
fetch('http://localhost:3000/api', {
  method: 'DELETE',
  headers: {'Content-Type': 'application/json'},
  body: '{}'
}).then(response => {
  console.log("1");
}).catch(err => {console.log(err); });

 }
function AddRecord()
{
fetch('http://localhost:3000/api', {
  method: 'PUT',
  headers: {'Content-Type': 'application/json'},
  body: '{}'
}).then(response => {
  console.log("2");
//  process.exit();
}).catch(err => {console.log(err);});

 }

function AddDelete()
{
  if(Math.random() < .5)
    {
      DeleteRecord();
    }
    else{
      AddRecord();
    }
}

 /*setInterval(function() {
    AddRecord();
 }, 30000);*/

 setInterval(function() {
  AddDelete();
 }, 30000);