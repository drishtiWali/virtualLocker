//content script to automatically fill in the username and password put in by the user the first time
//he/she accessed the site

var myLinkBasedProfile = [];         
var mySubmitButton;
var myLinkBasedUsername;
var myLinkBasedPassword;
var stopSignal = 0;
 
myLinkBasedProfile = document.forms;  //retrieve the form on the page

self.port.on("Username",function(username){
  myLinkBasedUsername = username;             //receiving the username from the stored list from the addon script
});

self.port.on("Password",function(password){     
  myLinkBaserdPassword = password;           //receiving the password from the stored list from the addon script
});

self.port.on("stopSignal",function(stopSignal){
  if(!stopSignal)
  if(myLinkBasedProfile){
    for(var i=0 ; i < myLinkBasedProfile[0].elements.length; i++){  //loop to go over the elements of the form obtained
      var myFormElement=myLinkBasedProfile[0].elements[i];
  
      if(myFormElement.getAttribute('type')=='text')       //identifying the username and filling it
        myFormElement.value = myLinkBasedUsername;
  
      else if(myFormElement.getAttribute('type')=='password')   //identifying the password and filling it
        myFormElement.value = myLinkBasedPassword;
    }
  }
});
