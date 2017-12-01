var net = require('net');
var http = require('http');


//The url we want is `www.nodejitsu.com:1337/`
var options = {
  host: 'localhost',
  path: '/',
  //since we are listening on a custom port, we need to specify it by hand
  port: '9000',
  //This is what changes the request to a POST request
  method: 'POST',
  headers: {'Content-Type': 'message/http'}
};
var server = net.createServer();

server.on("connection", function(socket){
	console.log("new client connection is made");
	console.log("remote address:  %s",socket.remoteAddress);
	console.log("remote address:  %d", socket.remotePort);
	var _data = '';
	//open a new socket with the http server

	socket.on("data", function(data){
		//console.log("curr is %s", data);
		_data += data; 																				// TODO: fix
		//console.log("payload is now %s", _data);
	});

	socket.once("close", function(){
		callback = function(response) {
		  var str = '';

		  //another chunk of data has been recieved, so append it to `str`
		  response.on('data', function (chunk) {
		    str += chunk;
		  });

		  //the whole response has been recieved, so we just print it out here
		  response.on('end', function () {
		    console.log(str);
		  });
		}

		var req = http.request(options, callback);
		req.write(_data); // Posting the data that 
		req.end();
	});

	socket.on("error",function(err){
		_data = err.getMessage();
	});
});

server.listen(process.env.PORT || 5000, function(){
	console.log("server is listening to %j", server.address());
});