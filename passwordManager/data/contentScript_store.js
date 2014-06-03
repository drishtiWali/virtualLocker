//Content script to be attached to every web page
// Assuming only username and password and only one form

var myLinkURI;                      //retrieve the url of the site
var mySubmitButtonIndex;
var myLinkBasedUsernameIndex;
var myLinkBasedUsername;
var myLinkBasedPasswordIndex;
var myLinkBasedPassword;
var stopSignal = 0;
 
self.port.on("Submitting", function(){                                 //When signal received frm main about form submission      
  self.port.emit("myLinkBasedUsername",document.forms[0].elements[myLinkBasedUsernameIndex].value);//send username
  self.port.emit("myLinkBasedPassword",document.forms[0].elements[myLinkBasedPasswordIndex].value);//send password
});
myLinkURI = document.documentURI; 
self.port.emit("Site",myLinkURI);              //send the url of the site to the addon script

self.port.on("stopSignal",function(stopSignal){
  if(!stopSignal){
    if(document.forms[0]){
      for(var i=0 ; i < document.forms[0].length ; i++){
        var myFormElement=document.forms[0].elements[i];
        
        if(myFormElement.type == 'submit')                         //identifying the submit button
          mySubmitButtonIndex=i;
  
        else if(myFormElement.getAttribute('type')=='text')       //identifying the username and retrieving it
          myLinkBasedUsernameIndex=i; 
   
        else if(myFormElement.getAttribute('type')=='password')   //identifying the password and retrieving it
          myLinkBasedPasswordIndex=i;
      }
      console.log("hi from store content script");
      
    }
  }
});
