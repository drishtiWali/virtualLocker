var loginUsername = document.getElementById("loginUsername");
var loginPassword = document.getElementById("loginPassword");
var registerUsername = document.getElementById("signUpUsername");
var registerPassword = document.getElementById("signUpPassword");

var loginSubmit = document.getElementById("loginSubmit");
var signUpSubmit = document.getElementById("signUpSubmit");

loginSubmit.onclick = function(event){
  addon.port.emit("signal",1);
  addon.port.emit("Username",loginUsername.value);
  addon.port.emit("Password",loginPassword.value);
}

signUpSubmit.onclick = function(event){
  addon.port.emit("signal",2);
  addon.port.emit("Username",registerUsername.value);
  addon.port.emit("Password",registerPassword.value);
}
