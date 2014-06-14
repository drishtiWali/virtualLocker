var data = require("sdk/self").data;                                        //to refer to all scripts in data directory
var loginPageStore = require("./loginPageStore");
var autofillScript = require("./autofillScript");
var database = require("./database.js");
var version ;
var entry_page = require("sdk/panel").Panel({              //panel for login or sign up
  contentURL: data.url("menu.html")
});

var num1 = 1;

//var logoff = require("sdk/page-mod");
var pageMod_autofill = require("sdk/page-mod");   //worker for autofill content script
var pageMod_store = require("sdk/page-mod");        //worker for store content script
var site_url;      

require("sdk/ui/button/action").ActionButton({               //attaching the panel to a button
  id: "show-panel",
  label: "Show Panel",
  icon: {
    "32": "./icon-16.png"
  },
  onClick: handleClick                                     //onclick of button call handleClick
});

/*logoff.PageMod({                              //page-mod object constructor for communication with content script store
  include: "*",                                                    // attch the content script for all web pages            
  contentScriptFile: data.url("contentScript_logoff.js"),              //content script to attch the page with    
  onAttach: function(worker){ 
    worker.port.on("closingWindow",function(e){
      database.deleteLocal();
      worker.port.emit("closed","1");
    });
  }
});*/

function handleClick(state) {                                        //called to trigger show event
  entry_page.show();
}

entry_page.port.on("signal", function (choice) {           //send signal wheather login info or sign up info is being sent
  if(choice==2&&entry_page.isShowing)                                                   //sign in info is sent
  {
    var count =1;
    entry_page.hide();                                              // hide panel
    entry_page.port.on("Username2",function(username){            //get username
      if(count==1){
        createUsername=username;
        entry_page.port.on("Password2",function(password){
          if(count==2){
            currentPassword=password;
            database.create_local(createUsername,0,password);                              //create local store
            database.create_global(createUsername,currentPassword);                             //create account globally
            count++;
          }
        });
        count++;
      }
    });
  }
  else                                                          //login info is sent
  {
	 var count =1;
	 entry_page.port.on("Username1",function(username){           //get username
	   if(count == 1){
	     createUsername=username;
	     entry_page.port.on("Password1",function(password){           //get password
	       if(count==2){
	         currentPassword=password;
	         var temp2=database.create_local(createUsername,1,password);//create local store & transfer data from global to local 
	         /*if(!temp2)
	           entry_page.port.emit("noChangeSignal",1);
	         else
	           entry_page.port.emit("noChangeSignal",0);
	        // entry_page.port.on("gotSignal",function(e){*/
	           entry_page.hide();
	        // });
	         count++;
	       }
	     });
	     count++;
	   }
	 });
   }  
});

entry_page.port.on("logoffSignal",function(signal){
  if(signal){
    database.deleteLocal();
    database.closeGlobal();
    entry_page.hide();
  }
  else
    entry_page.hide();
});
                                                    

pageMod_store.PageMod({                              //page-mod object constructor for communication with content script store
  include: "*",                                                    // attch the content script for all web pages            
  contentScriptFile: data.url("contentScript_store.js"),              //content script to attch the page with    
  onAttach: loginPageStore.storage
});
pageMod_autofill.PageMod({                           //page-mod object constructor for communication with content script autofill
  include: "*",                                                  //attach the content script with all web pages
  contentScriptFile: data.url("contentScript_autofill.js"),        
  onAttach: autofillScript.autofill
});

