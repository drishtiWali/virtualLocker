var store = require("./database.js");

function storage(worker){                                     
    worker.port.on("Site",function(site_given){                       //get site url 
      //Match = store.search(site_given); 
     // console.log(Match);                                        // if match found
      //if(Match)
       // worker.port.emit("stopSignal",1);                     // detach the content script to store credentials from the web page
     // else{
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
     //}
    });   
    worker.port.on("myLinkBasedUsername",function(username){        //add the filled username into the list
      //if(!Match)
      worker.port.on("myLinkBasedPassword",function(pass){           //add the filled password to the list
     // if(!Match)
        store.addSync(site_url,username,pass);
        console.log(pass);
        console.log(username);
      });
    });
    
}


exports.storage = storage;
