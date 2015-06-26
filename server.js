//var app = require('express')();
var http = require('http')


var users = [];


var server = http.createServer(function (request, response) {
  console.log("New request for '" + request.url + "' from someone.");
  
  response.write('OK!!');
  response.end();
});
    
server.listen('8080');