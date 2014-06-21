//Content script to be attached to every web page

var myLinkURI;                      //retrieve the url of the site
var mySubmitButtonIndex;
var myLinkBasedUsernameIndex;
var myLinkBasedPasswordIndex;
var stopSignal = 0;
var myLinkBasedUsername;
var myLinkBasedPassword;
var myFormIndex=0;

myLinkURI = document.documentURI; 
self.port.emit("Site",myLinkURI);              //send the url of the site to the addon script

self.port.on("stopSignal",function(stopSignal){
  self.port.emit("continue",!stopSignal);
  if(!stopSignal){
    self.port.on("Submitting", function(oldName){                //When signal received frm main about form submission 
      for(var i=0;i<document.forms.length;i++){
        if(document.forms[i].name=="VirtualLockerSpecialFOrm"){
          myFormIndex=i;
          document.forms[i].name=oldName;
          break;
        }
      }
      self.port.emit("formIndex",myFormIndex);
    });
  }  
  else{
    var myUsername="",myformIndex,myLinkBasedPassword;
    self.port.emit("message",1);
    self.port.on("Username",function(username){
      var i=0;
      while(username[i]!="+"){
        myUsername+=username[i];
        i++;
      }
      i++;
      myFormIndex=Number(username[i]);
      for(var i=0 ; i < document.forms[myFormIndex].length ; i++)
        if(document.forms[myFormIndex].elements[i].type=='password'){ //identifying the password and retrieving it
          myLinkBasedPasswordIndex=i;
          for(var j=i-1;j>=0;j--)
            if(document.forms[myFormIndex].elements[j].type=='text'){
              document.forms[myFormIndex].elements[j].value= myUsername; 
              break;
            }
        }
   	  self.port.emit("usernameConfirmation",1);
    });
    self.port.on("Password",function(password){     
  	  document.forms[myFormIndex].elements[myLinkBasedPasswordIndex].value= password;      
  	  self.port.emit("passwordConfirmation",1);
    });
  }
});
