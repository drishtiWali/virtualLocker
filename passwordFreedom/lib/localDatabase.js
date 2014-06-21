var { indexedDB } = require('sdk/indexed-db');             //using indexed db for client side and encrypted database
var local = {};
var masterUsername;

local.onerror = function(e) {                 
  console.error(e.value);
}

function create(currentUsername) {                     //creating a local database 
  var request = indexedDB.open("Local", 1);                          //name of database is local
  request.onupgradeneeded = function(e) {
    var db = e.target.result;
    e.target.transaction.onerror = local.onerror;
    var store = db.createObjectStore(currentUsername,{keyPath: "url"}); //the name of the one and only object store is the   
    masterUsername = currentUsername;
  };                                                                    //username with key as the site url(unique)
  request.onsuccess = function(e) {
    local.db = e.target.result;
    console.log("Created local account");
  };
  request.onerror = function(e){
    console.log(local.onerror);
  };
}

function addItem(url,username,password) {
  var db = local.db;      
  var trans = db.transaction([masterUsername], "readwrite");         
  var store = trans.objectStore(masterUsername);
  var request = store.put({
    "username": username,
    "url": url,
    "password": password
  });

  request.onsuccess = function(e){
  console.log("addition successful locally");
  }
  request.onerror = local.onerror;
};

function destroy(){
  local.db.close();
  var request = indexedDB.deleteDatabase("Local");
  request.onsuccess = function(event){
    console.log("Local database deleted");
  }
  request.onerror = function(e){
    console.log("Local database deletion error");
  }
}

function search(givenSite,worker){                    
  var db  = local.db;                         
  var objectStore = db.transaction(masterUsername).objectStore(masterUsername);
  var request = objectStore.get(givenSite);
  request.onsuccess= function(e){
    if(!request.result){
    	console.log("No match for autofill");
    	worker.port.emit("stopSignal",0); 
    }
    else{
  	  worker.port.emit("stopSignal",1);
  	}
  };
  request.onerror = function(e){
  	console.log("No match for autofill");
  };
}

function getCredential(givenSite,worker){                   
  var db = local.db;                         
  var objectStore = db.transaction(masterUsername).objectStore(masterUsername);
  var request = objectStore.get(givenSite);
  var credential={
   "url": "",
   "username": "",
   "password": ""
  };
  request.onsuccess= function(e){
    credential.url = givenSite;
    credential.username = request.result.username;
    credential.password = request.result.password;
    worker.port.emit("Username",credential.username); 
  }  
  return credential;
}  

exports.search = search;
exports.create = create;
exports.addItem = addItem;
exports.destroy = destroy;
exports.getCredential = getCredential;
