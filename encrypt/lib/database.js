var crypto = require("./aes.js");

var { indexedDB } = require('sdk/indexed-db');             //using indexed db for client side and encrypted database

var local_database = {};                //client-side db
var global_database = {};               //encrypted db
var storedVersion = require("sdk/simple-storage"); 

var num = 1;
var masterPassword;
var masterUsername;

//if(!storedVersion.storage.versionVal)
  storedVersion.storage.versionVal = 0;
	
local_database.onerror = function(e) {                 
  console.error(e.value);
}

function create_local(currentUsername,ifDecrypt,password) {                     //creating a local database named as the Decrypted
  var request = indexedDB.open("Decrypted", 1);
  masterPassword=password;
  masterUsername=currentUsername;
  //
  request.onupgradeneeded = function(e) {
    var db = e.target.result;
    e.target.transaction.onerror = local_database.onerror;
    var store = db.createObjectStore(currentUsername,{keyPath: "url"}); //the name of the one and only object store is the   
  };                                                                    //username with key as the site url(unique)
  request.onsuccess = function(e) {
    local_database.db = e.target.result;
    console.log("Created local account");
    if(ifDecrypt){
      var temp1= downloadGlobal(currentUsername,password);
      //if(!temp1)
      //  return 0;
    }
  };
  request.onerror = function(e){
    console.log(local_database.onerror);
  };
};

function addItem_local(credential,username) {
  var db = local_database.db;      
  var trans = db.transaction([username], "readwrite");         
  var store = trans.objectStore(username);
  var request = store.put({
    "username": credential.username,
    "url": credential.url,
    "password": credential.password
  });

  request.onsuccess = function(e){
  console.log("addition successful locally");
  }
  request.onerror = local_database.onerror;
};

/*function find(givenUrl) {
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
};*/

global_database.onerror = function(e) {
  console.error(e.value);
}

function create_global(currentUsername,password) {                  
  storedVersion.storage.versionVal++;                         //update version of the encrypted database
  var request = indexedDB.open("Encrypted",storedVersion.storage.versionVal );//open encrypted database                  
    request.onupgradeneeded = function(e) {                              
    var db1 = e.target.result;
    e.target.transaction.onerror = global_database.onerror;
    var store = db1.createObjectStore(currentUsername,{keyPath: "url"});    //create object store with keypath as url
  };
  request.onsuccess = function(e) {
    global_database.db = e.target.result;
    console.log("Created global account");
    var db2 = global_database.db;
    var trans = db2.transaction([currentUsername], "readwrite");
    var store = trans.objectStore(currentUsername);
    var key = crypto.encrypt("JACNJ:rLV!cFC%R/]uyavq^'6]c]/j",password).toString();
    var jsonString = crypto.decrypt(key,password).toString(crypto.decryption);
    var request1 = store.put({
      "username": "null",
      "url": "1",
      "password": key
    });
    request1.onsuccess = function(event){
    console.log("Added public key");
    };
  };
  request.onerror = global_database.onerror;
};

function downloadGlobal(username,password){                //to transfer encrypted data from global to local database
  var request = indexedDB.open("Encrypted",storedVersion.storage.versionVal );
  request.onsuccess = function(e){
    console.log("Global opened");
    var temp = find_account(username,password,e);                //check if account exists and password matches
    //if(!temp)
     // return temp;  
  };
}

function find_account(username,password,e){ 
  global_database.db = e.target.result;            
  var db = global_database.db;
  if(db.objectStoreNames.contains(username)){
    var trans = db.transaction([username], "readonly");
    var store = trans.objectStore(username);
    var request = store.get("1");
    request.onsuccess= function(e){
      console.log("Username correct");
      var check_key = crypto.decrypt(request.result.password,password).toString(crypto.decryption);
  	  if(check_key != "JACNJ:rLV!cFC%R/]uyavq^'6]c]/j"){
        console.log("Password Incorrect");
       // return 0;
      }
      else{
        console.log("password correct");
        decryptAll(username,password,store);
      }
    };
  }
  else{
    console.log("No such username exists");
    //return 0;
  }
}

function decryptAll(username,password,objectStore_global){     //to decrypt all data under the username using the password and 
  var db_global = global_database.db;                     //store in local database
  var db_local  = local_database.db;                        
 // var objectStore_global = db_global.transaction(username).objectStore(username);
  var objectStore_local = db_local.transaction(username).objectStore(username);
  var request = objectStore_local.get("https://webmail.iitk.ac.in/webmail/src/login.php");
  request.onsuccess= function(e){
    if(!request.result){
    	console.log("No such recor exixts");
    }
    else{
  	  console.log("match exists");
  	}
  }
  objectStore_global.openCursor().onsuccess = function(event) {
    var cursor = event.target.result;
    if (cursor&&cursor.key!=1) {
      var credential;
      //credential.url=crypto.decrypt(cursor.key,password).toString(crypto.decryption);
      credential.username = crypto.decrypt(cursor.value.username,password).toString(crypto.decryption);
      credential.password = crypto.decrypt(cursor.value.password,password).toString(crypto.decryption);
      addItem_local(credential,username);
      cursor.continue();
    }
  };
};
 
function deleteLocal(){
  local_database.db.close();
  var request6 = indexedDB.deleteDatabase("Decrypted");
  request6.onsuccess = function(event){
    console.log("Local database deleted");
  }
  request6.onerror = function(e){
    console.log("Local database deletion error");
  }
}

function closeGlobal(){
  global_database.db.close();
  console.log("Global closed");
}

function search(givenSite,worker){                    
  var db_local  = local_database.db;                         
  var objectStore_local = db_local.transaction(masterUsername).objectStore(masterUsername);
  var request = objectStore_local.get(givenSite);
  request.onsuccess= function(e){
    if(!request.result){
    	console.log("No match for autofill");
    	worker.port.emit("stopSignal",0); 
    }
    else{
  	  console.log(request.result.username+"	  "+request.result.password + "  "+givenSite);
  	  worker.port.emit("stopSignal",1);
  	}
  };
  request.onerror = function(e){
  	console.log("No match for autofill");
  };
}

function addItem_global(credential,username){
  var db = global_database.db;
  //credential.url = crypto.encrypt(credential.url,masterPassword).toString();
  credential.username = crypto.encrypt(credential.username,masterPassword).toString();
  credential.password = crypto.encrypt(credential.password,masterPassword).toString();
  var trans = db.transaction([username], "readwrite");
  var store = trans.objectStore(username);
  var request = store.put({
    "username": credential.username,
    "url": credential.url,
    "password": credential.password
  });

  request.onsuccess = function(e){
    console.log("addition successful");
    console.log(credential.url+"from additem_global");
    var request1 = store.get(credential.url);
    request1.onsucess=function(e1){
      if(!request1.result)
        console.log("Problem in addition");
      else
        console.log("Problem not in addtion atleast");
    }
  }
  request.onerror = global_database.onerror;
}; 

function addSync(url,username,password){
  var credential = {
    "url" :url,
    "username" : username,
    "password" : password
  };
  console.log(credential.url);
 addItem_local(credential,masterUsername);
 addItem_global(credential,masterUsername);
}

function getCredential(givenSite,worker){                   
  var db_local  = local_database.db;                         
  var objectStore_local = db_local.transaction(masterUsername).objectStore(masterUsername);
  var request = objectStore_local.get(givenSite);
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

exports.create_local = create_local;
exports.create_global = create_global;
exports.search = search;
exports.deleteLocal = deleteLocal;
exports.closeGlobal = closeGlobal;
exports.addSync = addSync;
exports.getCredential = getCredential;
