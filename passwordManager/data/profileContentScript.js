var myLinkBasedProfile = document.form;
var myLinkURI = document.documentURI;
var mySubmitButton;
var myLinkBasedUsername;
var myLinkBasedPassword;
 
for(var i=0 ; i < myLinkBasedProfile.elements.length; i++){
  var myFormElement=myLinkBasedProfile[i];
  
  if(myFormElement.getAttribute('type')=='submit')
    mySubmitButton=myFormElement;
  
  else if(myFormElement.getAttribute('type')=='text')
    myLinkBasedUsername=myFormElement;
  
  else if(myFormElement.getAttribute('type')=='password')
    myLinkBasedPassword=myFormElement;
}

mySumbitButton.onclick = function(){
  console.log(myLinkBasedUsername);
  self.port.emit("Username",myLinkBasedUsername);
  self.port.emit("Password",myLinkBasedPassword);
  self.port.emit("Site",myLinkURI);
}
