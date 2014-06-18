var RequestGet = require("sdk/request").Request;
var getUrl = RequestGet({
  url: "http://localhost:8080/",               //node server url
  onComplete: function (response) {
    console.log(response.text);
  }
}).get();                      //getting the values from db via server
var url="1myUrl";
var username="2myUsername";
var password="3myPassword";
var RequestPost = require("sdk/request").Request;
var postUrl = RequestPost({
  url: "http://localhost:8080/",
  content: url,
  onComplete: function (response) {
    console.log(response.text);
    var postUsername = RequestPost({
      url: "http://localhost:8080/",
      content: username,
      onComplete: function(response){
        var postPassword = RequestPost({
          url: "http://localhost:8080/",
          content: password,
          onComplete: function(response){
            console.log("password sent");
          }
        }).post();                               //first url, then username and then password is sent
      }
    }).post();
  }
}).post();
