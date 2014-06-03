//The main file where the addon execution starts from

var data = require("sdk/self").data;              //object using data api                              
var storedList = require("sdk/simple-storage");     //object using simple-storage api for usernames
var pageMod_autofill = require("sdk/page-mod");   //worker for autofill content script
var pageMod_store = require("sdk/page-mod");        //worker for store content script
var Match = false;                                  //object to check if credentials for the site have been stored before
var foundMatch = 0; 
var addon_i=0; 
var site_url; 

if(!storedList.storage.site)                                   //declare the array only if not declared before
  storedList.storage.site = [];
if(!storedList.storage.username)
  storedList.storage.username = [];
if(!storedList.storage.Password)
  storedList.storage.password = [];
  
var search = function (siteValue){ 
  if(storedList.storage.site[0]){                                                    //function to search if site loaded has been 
    for(addon_i = 0 ; addon_i < storedList.storage.site.length ; addon_i++){        //stored with credential details before
      if( siteValue == storedList.storage.site[addon_i]){
        foundMatch = addon_i;                                              //position in stored list array corresponding to match 
        return true;
      }
    }
  }
  return false;
}                             

pageMod_store.PageMod({                              //page-mod object constructor for communication with content script store
  include: "*",                                                    // attch the content script for all web pages            
  contentScriptFile: data.url("contentScript_store.js"),              //content script to attch the page with    
  onAttach: function(worker){                                         //on attach via worker 
    worker.port.on("Site",function(site_given){                       //get site url 
      Match = search(site_given); 
      console.log(Match);                                        // if match found
      if(Match)
        worker.port.emit("stopSignal",1);                     // detach the content script to store credentials from the web page
      else{
        worker.port.emit("stopSignal",0);                      
        console.log(site_given);
        site_url=site_given;
        var {Cc, Ci, Cr,Cu} = require("chrome");
        var {XPCOMUtils} = Cu.import("resource://gre/modules/XPCOMUtils.jsm");
        var {Services} = Cu.import("resource://gre/modules/Services.jsm");
        var observer = {
          QueryInterface:XPCOMUtils.generateQI([Ci.nsIObserver,Ci.nsIFormSubmitObserver,Ci.nsISupportsWeakReference]),
          notify : function (formElement, aWindow, actionURI) {
            console.log("notification works");
            worker.port.emit("Submitting",1);
            return true;
          },
        };

        Services.obs.addObserver(observer, "earlyformsubmit", false);
      }
    });   
    worker.port.on("myLinkBasedUsername",function(username){        //add the filled username into the list
      if(!Match)
        storedList.storage.username.push(username);
        console.log(username);
    });
    worker.port.on("myLinkBasedPassword",function(pass){           //add the filled password to the list
      if(!Match)
        storedList.storage.password.push(pass);
        console.log(pass);
        storedList.storage.site.push(site_url);  //otherwise add the site url to the list
    });
    
  }
});
pageMod_autofill.PageMod({                           //page-mod object constructor for communication with content script autofill
  include: "*",                                                  //attach the content script with all web pages
  contentScriptFile: data.url("contentScript_autofill.js"),        
  onAttach: function(worker){
    worker.port.on("Site",function(site_given){
      Match = search(site_given); 
      console.log(Match);
      if(Match){ 
        worker.port.emit("stopSignal",0);
        worker.port.on("message",function(confirmation){ 
          console.log("main got signal");                                                   
          worker.port.emit("Username",storedList.storage.username[foundMatch]);  //send the corresponding usrname
          worker.port.on("usernameConfirmation",function(usrnm){
            console.log("main got signal that cs got username");
            worker.port.emit("Password",storedList.storage.password[foundMatch]);      // and password
            worker.port.on("passwordConfirmation",function(passrec){
              console.log("main got signal that cs got password");
              worker.port.emit("makeChanges",1);
            });
          });
        });  
      }
      else
        worker.port.emit("stopSignal",1);                               //if no match dettach the content script from the web page
    });
  }
});

