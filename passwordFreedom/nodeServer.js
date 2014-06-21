var mongojs = require("mongojs");                                        //using mongojs module
var uri = "mongodb://drishti:oscarwali@ds053937.mongolab.com:53937/virtual_locker";   //connecting db
var db = mongojs.connect(uri);                    
var http = require('http');                                  //for setting up server                     
var masterUsername="",password="",key="";      //for initialsing and converting all variables to string while passing             
var done=0,doneSignin=0,getPassword=0,getUrl=0,getUsername=0,gotCredentials=0;       //to know what to do with which post request
var gotUsername=0,gotUrl=0;
var events = require('events');
var eventEmitter = new events.EventEmitter();
var masterUsernameMain;
var url="",username="",pass="";

http.createServer(function (request, response){
  if(request.method=="POST"){                      //when addon sends url/username/password
    var body="";
    request.on('data',function(chunk){
      body+=chunk;
      
      if(body[0]=='0'){                                        //code for username to create collection
        done=0;
        console.log("got username ");
        for(var i=1;i<body.length;i++)
          masterUsername+=body[i]; 
      }
      
      else if(body[0]=='1'){                                    //code for giving username to sign in
        for(var i=1;i<body.length;i++)
          masterUsername+=body[i]; 
        doneSignin=1;
      }
      
      else if(body[0]=='k'&&body[1]=='e'&&body[2]=='y'){                   //code to know key wsa sent
        done=1;
        console.log("got key");
        for(var i=3;i<body.length;i++)
          key+=body[i];
      }
     
      else if(body[0]=='3'){
        for(var i=1;i<body.length;i++)
          masterUsername+=body[i];
        getUsername=1;
      }
     
      else if(body[0]=='2'){
        for(var i=1;i<body.length;i++)
          masterUsername+=body[i];
        getUrl=1;
      }
     
      else if(body[0]=='4'){
        for(var i=1;i<body.length;i++)
          masterUsername+=body[i];
        getPassword=1;
      } 
      
      else if(body[0]=='5'&&gotUrl==1){
        for(var i=1;i<body.length;i++)
          url+=body;
          gotUrl++;
          console.log("from server about 1");
      }
      
      else if(body[0]=='6'&&gotUsername==1){
        for(var i=1;i<body.length;i++)
          username+=body;
          gotUsername++;
          console.log("from server");
      }
      
      else if(body[0]=='7'&&gotCredentials==1){
        for(var i=1;i<body.length;i++)
          pass+=body;
        gotCredentials++;
        
      }
          
    });
    
    
    request.on('end', function () {
      if(done==1){
        db.createCollection(masterUsername,function(err,col){
          masterUsernameMain=masterUsername;
          if(err){
            console.log(err);
            return;
          }
          console.log("Created collection");
          col.insert({"key": key},function(err,records){
            if(err){
              console.log("There was an error creating global collection.");
              masterusername="";
              key="";
              done=0;
              return;
            }
            console.log("Created global account");
            done=0;
            masterUsername="";
            key="";
          });
        });
      }
      
      else if(doneSignin==1){
        doneSignin=0;
        var col = db.collection(masterUsername);
        masterUsernameMain=masterUsername;
        col.find({},{ key: 1 },function(err,records){
          if(err){
            console.log(err);
            return;
          }
          var str="";
          response.writeHead(200, {'Content-Type': 'text/plain'});
          str+=records[0].key;
          response.write(str);
          masterUsername="";
          response.end();
        });
      }
      
      else if(getUsername){
        getUsername=0;
        var str="";
        var col = db.collection(masterUsername);
        masterUsername="";
        col.find({},{ key : 0}, function(err, cursor) {
          if(err){
            console.log(err);
            return;
          }
          for(var i=1;cursor[i]!=null;i++)
            str+=cursor[i].username+" ";
          response.writeHead(200, {'Content-Type': 'text/plain'});
          response.write(str);
          response.end();
        });
      }
      
      else if(getUrl){
        getUrl=0;
        var str="";
        var col = db.collection(masterUsername);
        masterUsername="";
        col.find({},{ key : 0,_id: 0 }, function(err, cursor) {
          if(err){
            console.log(err);
            return;
          }
          for(var i=1;cursor[i]!=null;i++)
            str+=cursor[i].url+" ";
          response.writeHead(200, {'Content-Type': 'text/plain'});
          response.write(str);
          response.end();
        });
      }
      
      else if(getPassword){
        getPassword=0;
        var str="";
        var col = db.collection(masterUsername);
        masterUsername="";
        col.find({},{ key : 0}, function(err, cursor) {
          if(err){
            console.log(err);
            return;
          }
          for(var i=1;cursor[i]!=null;i++)
            str+=cursor[i].password+" ";
          response.writeHead(200, {'Content-Type': 'text/plain'});
          response.write(str);
          console.log("Transferred all info ");
          response.end();
        });
      } 
      
      else if(gotCredentials==1){
        var col = db.collection(masterUsernameMain);
        gotCredentials=0;
        col.insert({"url": url, "username": username, "password": pass},function(err,records){
          if(err){
            console.log("There was an error inserting data globally");
            console.log(err);
            return;
          }
          console.log("Inserted the data");
          url="";
          username="";
          pass="";
          response.end();                  
        });  
      }
        console.log("is this coming");
    }); 
  }          
}).listen(8080);

console.log('Server started');
