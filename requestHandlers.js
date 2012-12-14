//var exec = require("child_process").exec;
var querystring = require("querystring"),
    fs = require("fs"),
    formidable = require("formidable");
    
function start(response, request) {
 
  console.log("Manipulador de petición 'start' ha sido llamado.");
 	var date = new Date();	   
	        console.log("Starting at " + date + " from " + request.connection.remoteAddress);
	date = null;
	console.log(request.headers);
    response.writeHead(200, {"Content-Type": "text/html"});
    response.end(fs.readFileSync("./index.html")); 

}
/*
function chat(response) {
	console.log("Manipulador de petición 'chat' ha sido llamado.");
    response.writeHead(200, {"Content-Type": "text/javascript"});
    response.end(fs.readFileSync("./chat.js")); 

}
function peer(response) {
	console.log("Manipulador de petición 'peer' ha sido llamado.");
    response.writeHead(200, {"Content-Type": "text/javascript"});
    response.end(fs.readFileSync("./peerConnection.js")); 

}
*/

function upload(response, request) {
    var form = new formidable.IncomingForm();
    console.log("Manipulador de petición 'upload' ha sido llamado.");
    console.log("almost parsing")   ;
    form.parse(request,function(error, fields, files) {
        console.log("content parsed")   ;
        /* Possible error on Windows systems:
       tried to rename to an already existing file */
        fs.rename(files.upload.path, "/tmp/test.png", function(err) {
        if (err) {
            
            console.log(err)   ;
            fs.unlink("./tmp/test.png");
            fs.rename(files.upload.path, "/tmp/test.png",function(err) {
                console.log("SEGUNDO ERROR: "+ err)   ;
            });
        }
        console.log("Rename and callback done")   ;
        });
        console.log("After Call back")   ;
          
    });
    //response.writeHead(200, {"Content-Type": "text/plain"});
    
    response.write("<html><head></head><body>");
    
    response.write("<p>Receive something</p>");

    response.write("<img src='/show' />");
    response.write("</body></html>");
    response.end();
  
}

function show(response) {
  console.log("Request handler 'show' was called.");
  fs.readFile("/tmp/test.png", "binary", function(error, file) {
    if(error) {
      response.writeHead(500, {"Content-Type": "text/plain"});
      response.write(error + "\n");
      response.end();
    } else {
      response.writeHead(200, {"Content-Type": "image/png"});
      response.write(file, "binary");
      response.end();
    }
  });
}

function serve(response,request,pathname){
	
  console.log("Request handler serve has been triggered, trying to serve a file.");
  var address = "./public"+pathname
  console.log(address);
  fs.readFile(address, "binary", function(error, file) {
    if(error) {
        response.writeHead(404, {"Content-Type": "text/plain"});
        response.write("404 Not found");
 
        response.end();
    } else {
	      fs.stat(address, function(error, stat){
      		if(error) {
		        response.writeHead(404, {"Content-Type": "text/plain"});
		        response.write(error); 
		        response.end();      	
      		}else{
  
		      var ext = pathname.substring((pathname.lastIndexOf("."))+1);
		      switch (ext){
		      	case "js":
		      		response.setHeader("Content-Type", "application/javascript");
		      		break
		      	case "css":
		      		response.setHeader("Content-Type", "text/css");
		      		break
		      	case "mp3":
		      		response.setHeader("Content-Type", "audio/mpeg");
		       		break
		      	default:	
		      		
		      		
		      }
          //Caching code
		    var etag = stat.size + '-' + Date.parse(stat.mtime);
		    response.setHeader('Last-Modified', stat.mtime);
		    
		    if (request.headers['if-none-match'] === etag) {
	            response.statusCode = 304;
	            response.end();
          	}else{
          		response.setHeader('Content-Length', file.length);
           		response.setHeader('ETag', etag);
           		response.statusCode = 200;
     			response.write(file,"binary");
     			response.end();
          	}
	  		
	  		}	      
	    });
    }
  });
	
	
	
	
	
}


exports.start = start;
//exports.chat = chat;
exports.upload = upload;
exports.show = show;
//exports.peer = peer;
exports.serve = serve;

   /*
   var body = '<html>'+
    '<head>'+
    '<meta http-equiv="Content-Type" content="text/html; '+
    'charset=UTF-8" />'+
    '</head>'+
    '<body>'+
    '<form action="/upload" enctype="multipart/form-data" '+
    'method="post">'+
    '<input type="file" name="upload">'+
    '<input type="submit" value="Upload file" />'+
    '</body>'+
    '</html>';
    */