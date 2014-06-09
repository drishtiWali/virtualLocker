var data = require("sdk/self").data;                                        //to refer to all scripts in data directory

var database = require("./database.js");
var version ;
var entry_page = require("sdk/panel").Panel({              //panel for login or sign up
  contentURL: data.url("menu.html")
});

var logoff = require("sdk/page-mod");

require("sdk/ui/button/action").ActionButton({               //attaching the panel to a button
  id: "show-panel",
  label: "Show Panel",
  icon: {
    "32": "./icon-16.png"
  },
  onClick: handleClick                                     //onclick of button call handleClick
});

logoff.PageMod({                              //page-mod object constructor for communication with content script store
  include: "*",                                                    // attch the content script for all web pages            
  contentScriptFile: data.url("contentScript_logoff.js"),              //content script to attch the page with    
  onAttach: function(worker){ 
    worker.port.on("closingWindow",function(e){
      database.deleteLocal();
      worker.port.emit("closed","1");
    });
  }
});

function handleClick(state) {                                        //called to trigger show event
  entry_page.show();
}

entry_page.on("show", function() {                                //when heard about need to show with the web browser
  entry_page.port.emit("show");                                   //send message to panel to show
});

database.deleteAll();

entry_page.port.on("signal", function (choice) {                //whenever user clicks on a button on panel
  console.log(choice);                                         //send signal wheather login info or sign up info is being sent
  if(choice==2)                                                   //sign in info is sent
  {
    entry_page.port.on("Username",function(username){            //get username
      createUsername=username;
      console.log("got username");
      entry_page.port.on("Password",function(password){
        console.log("got password");
        currentPassword=password;
         database.create_local(createUsername);                              //create local store
         database.create_global(createUsername,currentPassword);                             //create account globally
        entry_page.hide();                                              // hide panel
      });
    });
  }
  else                                                          //login info is sent
  {
	 entry_page.port.on("Username",function(username){            //get username
	   createUsername=username;
	   console.log("got username");
	   entry_page.port.on("Password",function(password){           //get password
	     currentPassword=password;
	     console.log("got password");
	      //database.create_local(createUsername);                               //create local store
	     //database.downloadGlobal(createUsername,password);                   //transfer data from global to local store
	     entry_page.hide();
	   });
	 });
   }  
});
