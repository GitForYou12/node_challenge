'use strict';

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

global.io = io;
module.exports = app; // for testing

var config = {
  appRoot: __dirname // required config
};

app.get('/', function(req,res) {
  res.sendfile('public/index.html');
});

//Whenever someone connects this gets executed



SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);
  

  var port = process.env.PORT || 3000;
  http.listen(port);

  /*if (swaggerExpress.runner.swagger.paths['/hello']) {
    console.log('try this:\ncurl http://127.0.0.1:' + port + '/hello?name=Scott');
  }*/
});
