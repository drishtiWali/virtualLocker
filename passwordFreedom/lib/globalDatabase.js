var crypto = require("./aes.js");            //for the encryption lib
var Request = require("sdk/request").Request;             //for sending requests to http node server
var local = require("./localDatabase.js");
var main = require("./main.js");

function create(currentUsername,currentPassword){
  var key = crypto.encrypt("JACNJ:rLV!cFC%R/]uyavq^'6]c]/j",currentPassword).toString();
  var Create = Request({
    url: "http://localhost:8080/",
    content: "0"+currentUsername,                                    
    onComplete: function (response) {
      var sendKey = Request({
        url: "http://localhost:8080/",
        content: "key"+key,
        onComplete: function(response){
          console.log("key sent to server");
        }
      }).post();
    }
  }).post();
}

function check(currentUsername,currentPassword,panelPage){
  var verifyLogin = Request({
    url: "http://localhost:8080/",
    content: "1"+currentUsername, 
    onComplete: function(response){ 
      var ret=0;
      if(response.text){
        var decryptedKey = crypto.decrypt(response.text,currentPassword).toString(crypto.decryption);
        if(decryptedKey == "JACNJ:rLV!cFC%R/]uyavq^'6]c]/j"){
          panelPage.port.emit("continue",1);
          console.log("password correct");
          ret=1;
        }
      }
      if(!ret){
        panelPage.port.emit("nonoChangeSignal",1);
        console.log("login failed");
      }
    }                                  
  }).post();
}

function transfer(currentUsername,currentPassword){
  var getUrl = Request({
    url: "http://localhost:8080/",
    content:"2"+currentUsername,
    onComplete: function(resUrl){
      var getUsername = Request({
        url: "http://localhost:8080/",
        content:"3"+currentUsername,
        onComplete: function(resUsername){
          var getPass = Request({
            url: "http://localhost:8080/",
            content:"4"+currentUsername,
            onComplete: function(resPassword){
              var tmpPassword="", tmpUrl="", tmpUsername = "";
              tmpPassword+=resPassword.text;
              tmpUsername+=resUsername.text;
              tmpUrl+=resUrl.text;
              var indexPass=0,indexUsername=0,indexUrl=0;
              var url,username,password="a";
              while(indexPass<tmpPassword.length){
                url=username=password="";
                for(;tmpPassword[indexPass]!=" ";indexPass++)
                  password+=tmpPassword[indexPass];
                indexPass++;
                for(;tmpUsername[indexUsername]!=" ";indexUsername++)
                  username+=tmpUsername[indexUsername];
                indexUsername++;
                for(;tmpUrl[indexUrl]!=" ";indexUrl++)
                  url+=tmpUrl[indexUrl];
                indexUrl++;
                if(password){
                  //url=crypto.decrypt(url,currentPassword).toString(crypto.decryption);
                  //username=crypto.decrypt(username,currentPassword).toString(crypto.decryption);
                 // password=crypto.decrypt(password,currentPassword).toString(crypto.decryption);
                  console.log(url);
                  console.log(username);
                  console.log(password);
                  local.addItem(url,username,password);
                }
              }
            }
          }).post();
        }
      }).post();
    }
  }).post();
}

function addItem(siteUrl,username,password){
  var masterPassword = main.getPassword();
  siteUrl = crypto.encrypt(siteUrl,masterPassword).toString();
  username = crypto.encrypt(username,masterPassword).toString();
  password = crypto.encrypt(password,masterPassword).toString();
  var credential={
  "url": siteUrl,
  "username": username,
  "password": password
  };
  var sendCredential = JSON.stringify(credential);
  console.log(sendCredential);
  var postUrl = Request({
    url: "http://localhost:8080/",
    content: sendCredential,
    onComplete: function (response1) {
      console.log("Credentials sent to online database");
    }
  }).post();
}
  
exports.create = create; 
exports.transfer = transfer;
exports.check = check;
exports.addItem = addItem;
