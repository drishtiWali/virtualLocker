var loginUsername = document.getElementById("loginUsername");
var loginPassword = document.getElementById("loginPassword");
var registerUsername = document.getElementById("signUpUsername");
var registerPassword = document.getElementById("signUpPassword");

var loginSubmit = document.getElementById("loginSubmit");
var signUpSubmit = document.getElementById("signUpSubmit");

if(loginSubmit){
  loginSubmit.onclick = function(event){
    addon.port.emit("signal",1);
    addon.port.emit("Username1",loginUsername.value);
    addon.port.emit("Password1",loginPassword.value);
    addon.port.on("noChangeSignal",function(value){
      if(value)
        document.getElementByName("logIn").action="menu.html";
      else
        document.getElementByName("logIn").action="logoff.html";
      addon.port.emit("gotSignal",1);
    });
  }
}

if(signUpSubmit){
  signUpSubmit.onclick = function(event){
    addon.port.emit("signal",2);
    addon.port.emit("Username2",registerUsername.value);
    addon.port.emit("Password2",registerPassword.value);
  }
}

var logoffButton = document.getElementById("yes");
var cancelButton = document.getElementById("no");

if(logoffButton){
  logoffButton.onclick = function(event){
    console.log("Logging off");
    addon.port.emit("logoffSignal",1);
  }
}

if(cancelButton){
  cancelButton.onclick = function(event){
    addon.port.emit("logoffSignal",0);
  }
}
