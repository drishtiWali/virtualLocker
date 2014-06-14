//Content script to be attached to every web page
// Assuming only one form

var myLinkURI;                      //retrieve the url of the site
var mySubmitButtonIndex;
var myLinkBasedUsernameIndex;
var myLinkBasedPasswordIndex;
var stopSignal = 0;
var myLinkBasedUsername;
var myLinkBasedPassword;

myLinkURI = document.documentURI; 
self.port.emit("Site",myLinkURI);              //send the url of the site to the addon script

self.port.on("stopSignal",function(stopSignal){
  self.port.emit("continue",!stopSignal);
  if(document.forms[0]){
    for(var i=0 ; i < document.forms[0].length ; i++){
      var myFormElement=document.forms[0].elements[i];
        
      if(myFormElement.type == 'submit')                         //identifying the submit button
        mySubmitButtonIndex=i;
   
      else if(myFormElement.getAttribute('type')=='password'){   //identifying the password and retrieving it
        myLinkBasedPasswordIndex=i;
        for(var j=i-1;j>=0;j--)
        {
          if(document.forms[0].elements[j].type=='text'){
            myLinkBasedUsernameIndex = j;
            break;
          }          
        }
      }
    }
    console.log("hi from store content script");
    if(!stopSignal&&myLinkBasedPasswordIndex)
    {
      self.port.on("Submitting", function(){            //When signal received frm main about form submission      
        self.port.emit("myLinkBasedUsername",document.forms[0].elements[myLinkBasedUsernameIndex].value);//send username
        self.port.emit("myLinkBasedPassword",document.forms[0].elements[myLinkBasedPasswordIndex].value);//send password
      });
    }  
    else
    {
      self.port.emit("message",1);
      self.port.on("Username",function(username){
    	document.forms[0].elements[myLinkBasedUsernameIndex].value= username; 
  	    console.log("cs got username" + username);            //receiving the username from the stored list from the addon script
  	    self.port.emit("usernameConfirmation",1);
      });
      self.port.on("Password",function(password){     
  	    document.forms[0].elements[myLinkBasedPasswordIndex].value= password;      
  	    console.log("cs got password"+password);     //receiving the password from the stored list from the addon script
  	    self.port.emit("passwordConfirmation",1);
      });
      self.port.on("makeChanges",function(signal){
        console.log("message received");
      });
    }
  }
});
