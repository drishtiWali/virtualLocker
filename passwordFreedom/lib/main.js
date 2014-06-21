var data = require("sdk/self").data; 
var localDatabase = require("./localDatabase.js");            
var globalDatabase = require("./globalDatabase.js");
var panel_page = require("sdk/panel").Panel({              //panel for login or sign up
  contentURL: data.url("menu.html")
});
var pageMod = require("sdk/page-mod");        //worker for web page content script
var site_url;
var page_access = require("./page_access.js"); 
var currentUsername,currentPassword;


require("sdk/ui/button/action").ActionButton({               //attaching the panel to a button
  id: "show-panel",
  label: "Show Panel",
  icon: {
    "16": "./face.png"
  },
  onClick: handleClick                                     //onclick of button call handleClick
});

function handleClick(state) {                                        //called to trigger show event
  panel_page.show();
}

panel_page.port.on("signal", function (choice) {           //send signal wheather login info or sign up info is being sent
  if(choice==2)                                                   //sign in info is sent
  {
    var count =1;
    panel_page.hide();                                              // hide panel
    panel_page.port.on("Username2",function(username){            //get username
      if(count==1){
        currentUsername=username;
        panel_page.port.on("Password2",function(password){
          if(count==2){                                                   //ensuring that only taking username and password once
            currentPassword=password;
            localDatabase.create(currentUsername);                              //create local store
            globalDatabase.create(currentUsername,currentPassword);                             //create account globally
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
	 panel_page.port.on("Username1",function(username){           //get username
	   if(count == 1){
	     currentUsername=username;
	     panel_page.port.on("Password1",function(password){           //get password
	       if(count==2){
	         currentPassword=password;
	         globalDatabase.check(currentUsername,currentPassword,panel_page);
	         panel_page.port.on("goOn",function(val){
	           localDatabase.create(currentUsername);
	           globalDatabase.transfer(currentUsername,currentPassword);
	           panel_page.hide();
	         });
	       }
	       count++;
	     });
	     count++;
	   }
	 });
   } 
});

panel_page.port.on("logoffSignal",function(signal){
  if(signal){
    localDatabase.destroy();
    entry_page.hide();
  }
  else
    entry_page.hide();
});

pageMod.PageMod({                              //page-mod object constructor for communication with content script store
  include: "*",                                                    // attch the content script for all web pages            
  contentScriptFile: data.url("contentScript.js"),              //content script to attch the page with    
  onAttach: page_access.work
});

function getPassword(){
  return currentPassword;
} 

exports.getPassword = getPassword;
