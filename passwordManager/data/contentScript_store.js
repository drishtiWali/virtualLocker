//Content script to be attached to every web page
// Assuming only username and password and only one form

var myLinkBasedProfile;             //declaring array to get the form elements on the web page
var myLinkURI;    //retrieve the url of the site
var mySubmitButton;
var myLinkBasedUsername;
var myLinkBasedPassword;
var stopSignal = 0;
 
var submitting = function(){
        console.log("mocuseover");
                              //on clicking the submit button 
        console.log(myLinkBasedUsername);
        self.port.emit("Username",myLinkBasedUsername);           //send the username and password to main.js
        //self.port.emit("Password",myLinkBasedPassword);
      }
myLinkURI = document.documentURI; 
self.port.emit("Site",myLinkURI);              //send the url of the site to the addon script

//self.port.on("stopSignal",function(stopSignal){
  if(!stopSignal){
    //myLinkBasedProfile = document.forms;                //retrieve the form on the page
    console.log("hi");
    console.log(document.forms[0].onsumbit);
   if(document.forms){
      for(var i=0 ; i < document.forms[0].length ; i++){
        var myFormElement=document.forms[0].elements[i];
        
        if(myFormElement.type == 'submit')          //identifying the submit button
          mySubmitButton=i;
  
        else if(myFormElement.getAttribute('type')=='text')       //identifying the username and retrieving it
         { myLinkBasedUsername=myFormElement.value; }
   
       // else if(myFormElement.getAttribute('type')=='password')   //identifying the password and retrieving it
         // myLinkBasedPassword=myFormElement.value;
      }
      //document.forms[0].elements[mySubmitButton].disabled=true;
      document.forms[0].elements[mySubmitButton].onmouseover = submitting();
      console.log( document.forms[0].elements[mySubmitButton].onmouseover);
    }
  }
//});
