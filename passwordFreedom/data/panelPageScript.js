var loginUsername = document.getElementById("loginUsername");
var loginPassword = document.getElementById("loginPassword");
var registerUsername = document.getElementById("signUpUsername");
var registerPassword = document.getElementById("signUpPassword");

var loginSubmit = document.getElementById("loginSubmit");
var signUpSubmit = document.getElementById("signUpSubmit");

if(loginSubmit){
  loginSubmit.onclick = function(event){
    addon.port.emit("signal",1);                          //to signal the main script that login info is being sent
    addon.port.emit("Username1",loginUsername.value);
    addon.port.emit("Password1",loginPassword.value);
    addon.port.on("noChangeSignal",function(value){           
  	  document.getElementById("p2").innerHTML="Incorrect Username or Password";
    });
    addon.port.on("continue",function(val){
      addon.port.emit("goOn",1);
      console.log("logging in");
      location.href="logoff.html";
    });
  }
}

if(signUpSubmit){
  signUpSubmit.onclick = function(event){
    if(registerPassword.value==document.getElementById("verifyPassword").value){
      console.log("Signing in");
      location.href="logoff.html";
      addon.port.emit("signal",2);
      addon.port.emit("Username2",registerUsername.value);
      addon.port.emit("Password2",registerPassword.value);
    }
    else 
  	  document.getElementById("p1").innerHTML="Passwords do not match";  
  }
}

var logoffButton = document.getElementById("yes");
var cancelButton = document.getElementById("no");

if(logoffButton){
  logoffButton.onclick = function(event){
    console.log("Logging off");
    addon.port.emit("logoffSignal",1);
    location.href="menu.html";
  }
}

if(cancelButton){
  cancelButton.onclick = function(event){
    addon.port.emit("logoffSignal",0);
  }
}


  

