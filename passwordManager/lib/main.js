//The main file where the addon execution starts from

var data = require("sdk/self").data;                                  
var storedList = require("sdk/simple-storage");
var pageMod = require("sdk/page-mod");

if(!storedList.site)                                   //declare the array only if not declared before
  storedList.site = [];
  
if(!storedList.username)
  storedList.username = [];
  
if(!storedList.password)
  storedList.password = [];

pageMod.PageMod({
  include: "*",                                        //attach content script to all web pages            
  contentScriptFile: data.url("contentScript.js"),     //source of content script
  onAttach: function(worker){
    worker.port.on("Username",function(username){   //add listeners for the 3 elements and receive their values from content script
      storedList.username.push(username);              //store the element in the storage list
    });
    worker.port.on("Password",function(pass){
      storedList.password.push(pass);
    });
    worker.port.on("Site",function(site){
      storedList.site.push(site);
    });
  }
});



