var mongojs = require("mongojs");                                        //using mongojs module
var uri = "mongodb://<dbusername>:<dbpassword>@ds053937.mongolab.com:53937/virtual_locker";   //connecting db
var db = mongojs.connect(uri, ["test"]);                    //collections to connect to

var http = require('http');                                  //for setting up server                     
var url="",username="",password="";             //for initialsing and converting all variables to string while passing             
var done=0;                                     //to singnal when password has also been received to ensure insertion is done

http.createServer(function (request, response){
  if(request.method=="POST"){                      //when addon sends url/username/password
  var body="";
  request.on('data',function(chunk){
    body+=chunk;
    if(body[0]=='1'){
      done=0;
      for(var i=1;i<body.length;i++)
        url+=body[i];
    }
    else if(body[0]=='2'){
      done =0;
      for(var i=1;i<body.length;i++)
        username+=body[i];
    }
    else if(body[0]=='3'){
      done=1;
      for(var i=1;i<body.length;i++)
        password+=body[i];
    } 
  });
  request.on('end', function () {
    if(done==1){
      db.test.insert({"url": url, "username": username, "password": password},function(err,records){
        if(err){
          console.log("There was an error executing the database query.");
          return;
        }
        console.log("Inserted the data");
      });
      url="";
      username="";
      password="";
    }
    response.end();
  });
  }
  if(request.method=="GET"){                  //when addon will download all data of the user
    response.writeHead(200, {'Content-Type': 'text/plain'});
    db.test.find({"url": "testUrl"},function(err,records){
      if(err){
        console.log("There was an error executing the database find");
        console.log(err);
        return;
      }

      //response.write("Hello");
      var str="";
      str+=records[0].url;
      response.write(str);
      console.log(records[0].url);
      response.end();
    }); 
  }
}).listen(8080);
 
console.log('Server started');
