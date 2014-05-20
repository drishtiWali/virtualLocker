var data = require("sdk/self").data;
var storedList = require("sdk/simple-storage");

if(!storedList.site)
  storedList.site = [];
  
if(!storedList.username)
  storedList.username = [];
  
if(!storedList.password)
  storedList.password = [];

contentScriptFile: data.url("profileContentScript.js")

ProfileContentScript.port.on("Username",function(username){
  storedList.username.push(username);
  console.log(username);
});

ProfileContentScript.port.on("Password",function(pass){
  storedList.password.push(pass);
});

ProfileContentScript.port.on("Site",function(site){
  storedList.site.push(site);
});

