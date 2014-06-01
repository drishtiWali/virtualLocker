var { indexedDB, IDBKeyRange } = require('sdk/indexed-db');

var database = {};

var decryptedData=[];
var addition_index=0;

var getByUrl=[];
var list_index=0;

for(var i=0;i<4;i++)
{
  decryptedData.push({
    url:"url"+i,
    username:"username"+i,
    password:"password"+i
  });
}

for(var i=2;i<5;i++)
{
  getByUrl.push("url"+i);
  
}


database.onerror = function(e) {
  console.error(e.value)
}

function open(version) {
  var request = indexedDB.open("Credentials", version);
  request.onupgradeneeded = function(e) {
    var db = e.target.result;
    e.target.transaction.onerror = database.onerror;

    if(db.objectStoreNames.contains("Username")) {
      db.deleteObjectStore("Username");
    }

    var store = db.createObjectStore("Username",{keyPath: "url"});
  };

  request.onsuccess = function(e) {
    database.db = e.target.result;
  };

  request.onerror = database.onerror;
};

function addItem(credential) {
  var db = database.db;
  var trans = db.transaction(["Username"], "readwrite");
  var store = trans.objectStore("Username");
  var request = store.put({
    "username": credential.username,
    "url": credential.url,
    "password": credential.password
  });

  request.onsuccess = function(e){
    console.log("addition successfu;");
  }
  request.onerror = database.onerror;
};

function find(givenUrl) {
  var db = database.db;
  var trans = db.transaction(["Username"], "readonly");
  var store = trans.objectStore("Username");
  var request = store.get(givenUrl);
  request.onsuccess= function(e){
    if(!request.result)
    	console.log("No match. Continue with no change");
    else
  	  console.log(request.result.username+"	  "+request.result.password);
  };
  request.onerror = function(e){
  	console.log("No match. Continue with no change");
  };
};

function listItems(itemList) {
  console.log(itemList);
}

open("1");

var add = require("sdk/ui/button/action").ActionButton({
  id: "add",
  label: "Add",
  icon: "./add.png",
  onClick: function() {
    addItem(decryptedData[addition_index]);
    addition_index++;
  }
});

var list = require("sdk/ui/button/action").ActionButton({
  id: "list",
  label: "List",
  icon: "./list.png",
  onClick: function() {
    find(getByUrl[list_index]);
    list_index++;
  }
});
