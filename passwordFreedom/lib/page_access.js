var local = require("./localDatabase.js");
var global = require("./globalDatabase.js");

var Match = false;                                  //object to check if credentials for the site have been stored before

function work(worker){                                     
  worker.port.on("Site",function(site_given){                       //get site url 
    local.search(site_given,worker); 
    worker.port.on("continue",function(Match){
      if(Match){
        site_url=site_given;
        var myLinkBasedUsername,myLinkBasedPassword,oldName,choice;
        var {Cc, Ci, Cr,Cu} = require("chrome");
        var {XPCOMUtils} = Cu.import("resource://gre/modules/XPCOMUtils.jsm");
        var {Services} = Cu.import("resource://gre/modules/Services.jsm");
        var observer = {
          QueryInterface:XPCOMUtils.generateQI([Ci.nsIObserver,Ci.nsIFormSubmitObserver,Ci.nsISupportsWeakReference]),
          notify : function (formElement, aWindow, actionURI) {
            if(formElement){
              oldName=formElement.name;
              formElement.name="VirtualLockerSpecialFOrm";
              for(var i=0 ; i < formElement.length ; i++){
                if(formElement.elements[i].type=='password'){   //identifying the password and retrieving it
                  myLinkBasedPassword=formElement.elements[i].value;
                  for(var j=i-1;j>=0;j--)
                    if(formElement.elements[j].type=='text'){
                      myLinkBasedUsername=formElement.elements[j].value;
                      break;
                    }          
                }
              }
            }
            choice = aWindow.confirm("Do you wish to save the password and username for this website?");
            worker.port.emit("Submitting",oldName);
            worker.port.on("formIndex",function(formIndex){        //add the filled username into the list
              myLinkBasedUsername+="+"+formIndex;
              console.log(site_given+"from loginPage");
              console.log(myLinkBasedPassword);
              console.log(myLinkBasedUsername);
              if(choice){
                local.addItem(site_given,myLinkBasedUsername,myLinkBasedPassword);
                global.addItem(site_given,myLinkBasedUsername,myLinkBasedPassword);
              }
            });
            return true;
          },
        };
        Services.obs.addObserver(observer, "earlyformsubmit", false);   
      }
      else{
        worker.port.on("message",function(confirmation){ 
          var credential = local.getCredential(site_given,worker);                    //send the corresponding usrname
          worker.port.on("usernameConfirmation",function(usrnm){
            worker.port.emit("Password",credential.password);                                    // and password
            worker.port.on("passwordConfirmation",function(passrec){
              console.log("credentials sent");
            });
          });
        });
      } 
    });
  }); 
}


exports.work = work;
