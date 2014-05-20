//Content script to be attached to every web page

var myLinkBasedProfile = document.form;  //retrieve the form on the page
var myLinkURI = document.documentURI;    //retrieve the url if the site
var mySubmitButton;
var myLinkBasedUsername;
var myLinkBasedPassword;
 
for(var i=0 ; i < myLinkBasedProfile.elements.length; i++){
  var myFormElement=myLinkBasedProfile[i];
  
  if(myFormElement.getAttribute('type')=='submit')          //identifying the submit button
    mySubmitButton=myFormElement;
  
  else if(myFormElement.getAttribute('type')=='text')       //identifying the username and retrieving it
    myLinkBasedUsername=myFormElement.value;
  
  else if(myFormElement.getAttribute('type')=='password')   //identifying the password and retrieving it
    myLinkBasedPassword=myFormElement.value;
}

mySumbitButton.onclick = function(){                        
//  console.log(myLinkBasedUsername);
  self.port.emit("Username",myLinkBasedUsername);           //send the elements to main.js
  self.port.emit("Password",myLinkBasedPassword);
  self.port.emit("Site",myLinkURI);
}
