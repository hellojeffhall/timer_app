var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');
var socket = require('socket.io');

var root = __dirname;
var tasks = [];

var sendPage = function (response, requested_url) {

    // Create readstream.
    var stream_read = fs.createReadStream(requested_url);
    
    // As the stream returns chunks of data, write them
    // to the repsonse.
    stream_read.on('data', function ( chunk ) {
        response.write(chunk);               
    });

    stream_read.on('error', function(err){
        console.log('error! requested_url: ' + requested_url);
        console.log(err);
        send404(response);
    });

    stream_read.on('end',function(){
        response.end();
    });
};

var send404 = function (response) {
    response.statusCode = 404;
    sendPage(response, path.join( root , '/404.html'));
};

var server = http.createServer(function (request, response) {
    
    // Get the absolute requested URL
    requested_url = path.join( root, url.parse(request.url).pathname );

    //
    // Make sure that the requested URL starts with the base directory, and
    // that there are no null bytes.
    //
    // Thank you to nodejitsu for the security tips!
    // https://docs.nodejitsu.com/articles/file-system/security/introduction
    //
    
    if( (requested_url.indexOf('\0')!==-1) || (requested_url.indexOf(root)!==0) ){
        console.log('NULL BYTE OR DIRECTORY TRAVERSAL ATTEMPT');
        send404(response);   
    }    
    else if( (requested_url) === (root + '/')){
        sendPage(response, requested_url + 'index.html');
    }
    else{
        sendPage(response, requested_url);
    }
      
}).listen(8080);

var io = socket.listen(server);

io.sockets.on('connection', function (socket) {
    console.log('new connection!');

    socket.on('task_create', function(data){
        console.log(typeof data);
        //console.log(typeof
        console.log('new task requested: ' + data.name);
        addTask(data.name, data.ts_start);
    });
    
});
var addTask = function (taskname, time_start) {
    tasks.push(taskname);
    io.sockets.emit('add_task', {name: taskname, ts_start : time_start});
};
