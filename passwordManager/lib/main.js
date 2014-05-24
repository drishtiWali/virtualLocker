//The main file where the addon execution starts from

var data = require("sdk/self").data;              //object using data api                              
var storedListUsername = require("sdk/simple-storage");     //object using simple-storage api
var pageMod_autofill = require("sdk/page-mod");   //worker for autofill content script
var pageMod_store = require("sdk/page-mod");        //worker for store content script
var Match = false;                                  //object to check if credentials for the site have been stored before
var foundMatch = 0; 
var addon_i=0;   

/*var search = function (siteValue){ 
  if(storedList.site[0]){                    //function to search if site loaded has been stored with credential details before
    for(addon_i = 0 ; addon_i < storedList.site.length ; addon_i++){
      if( siteValue == storedList.site[addon_i]){
        foundMatch = addon_i;
        return true;
      }
    }
  }
  return false;
}*/                             //position in stored list array corresponding to match 
console.log("works till here");
//if(!storedList.site)                                   //declare the array only if not declared before
  //storedList.site_given = [];
if(!storedListUsername)
  storedListUsername = [];
//if(!storedList.password)
  //storedList.password = [];

pageMod_store.PageMod({                              //page-mod object constructor for communication with content script store
  include: "*",                                        // attch the content script for all web pages            
  contentScriptFile: data.url("contentScript_store.js"), //content script to attch the page with    
  onAttach: function(worker){                            //on attach via worker 
    worker.port.on("Site",function(site_given){                //get site url 
     // Match = search(site);                              // if match found
     // if(Match)
     //   worker.port.emit("stopSignal",1);                                // dettach the content script to store credentials from the web page
     // else
     console.log(site_given);
     //     worker.port.emit("stopSigmal",0);
     // storedList.site_given.push(site_given);                      //otherwise add the site url to the list
    }); 
    //console.log("hi");  
    worker.port.on("Username",function(username){        //add the filled username into the list
      if(!Match)
        
        storedListUsername[0]=username;
                     
    });
    worker.port.on("Password",function(pass){           //add the filled password to the list
    //  if(!Match)
   //     storedList.password.push(pass);
    });
    
  }
});
pageMod_autofill.PageMod({                  //page-mod object constructor for communication with content script autofill
  include: "*",                                 //attach the content script with all web pages
  contentScriptFile: data.url("contentScript_autofill.js"),        
  onAttach: function(worker){
    if(Match){                                                        //if match was found send the corresponding usrname
      worker.port.emit("Username",storedListUsername[foundMatch]);   // and password
     // worker.port.emit("Password",storedList.password[foundMatch]);
    }
    else
      worker.port.emit("stopSignal",1);                                                //if no match dettach the content script from the web page
  }
});

