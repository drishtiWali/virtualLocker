avar store = require("./database.js");

var Match = false;                                  //object to check if credentials for the site have been stored before

function storage(worker){                                     
  worker.port.on("Site",function(site_given){                       //get site url 
    store.search(site_given,worker); 
    worker.port.on("continue",function(Match){
      if(Match){
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
        worker.port.on("myLinkBasedUsername",function(username){        //add the filled username into the list
          worker.port.on("myLinkBasedPassword",function(pass){           //add the filled password to the list
            console.log(site_given+"from loginPageStore");
            console.log(pass);
            console.log(username);
            store.addSync(site_given,username,pass);
          });
        });
      }
      else{
        worker.port.on("message",function(confirmation){ 
          console.log("main got signal"); 
          var credential = store.getCredential(site_given,worker);                    //send the corresponding usrname
          worker.port.on("usernameConfirmation",function(usrnm){
            console.log("main got signal that cs got username");
            worker.port.emit("Password",credential.password);                                    // and password
            worker.port.on("passwordConfirmation",function(passrec){
              console.log("main got signal that cs got password");
              worker.port.emit("makeChanges",1);
            });
          });
        });
      } 
    });
  }); 
}


exports.storage = storage;var store = require("./database.js");

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
