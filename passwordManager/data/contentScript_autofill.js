//content script to automatically fill in the username and password put in by the user the first time
//he/she accessed the site
         
var mySubmitButton;
var myLinkBasedUsername;
var myLinkBasedPassword;
var stopSignal = 1;


self.port.emit("Site",document.documentURI);              //send the url of the site to the addon script

self.port.on("Username",function(username){
  myLinkBasedUsername = username; 
  console.log("cs got username");            //receiving the username from the stored list from the addon script
  self.port.emit("usernameConfirmation",1);
});

self.port.on("Password",function(password){     
  myLinkBasedPassword = password;      
  console.log("cs got password");     //receiving the password from the stored list from the addon script
  self.port.emit("passwordConfirmation",1);
});


    
//if(document.documeURI!="null"){
//console.log(stopSignal);

self.port.on("stopSignal",function(givenSignal){
  stopSignal = givenSignal;
  console.log("CS Got signal");  
  self.port.emit("message",1);
});
self.port.on("makeChanges",function(signal){
  console.log("message received");
  if(document.forms[0]){
    for(var i=0 ; i < document.forms[0].elements.length; i++){  //loop to go over the elements of the form obtained
      var myFormElement=document.forms[0].elements[i];
  
      if(myFormElement.getAttribute('type')=='text')       //identifying the username and filling it
        myFormElement.value = myLinkBasedUsername;
  
      else if(myFormElement.getAttribute('type')=='password')   //identifying the password and filling it
        myFormElement.value = myLinkBasedPassword;
    }
  }
});

