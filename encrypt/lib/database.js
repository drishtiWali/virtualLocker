var crypto = require("./aes.js");

var { indexedDB } = require('sdk/indexed-db');             //using indexed db for client side and encrypted database

var local_database = {};                //client-side db
var global_database = {};               //encrypted db
var storedVersion = require("sdk/simple-storage"); 

<<<<<<< HEAD
var num = 1;
var masterPassword;

//if(!storedVersion.storage.versionVal)
  storedVersion.storage.versionVal = 0;
=======
//if(!storedVersion.storage.versionVal)
  storedVersion.storage.versionVal = 1;
>>>>>>> a1ae630cbb8926c602cbbb7ebdb1b076bc223ad1
	
local_database.onerror = function(e) {                 
  console.error(e.value);
}

<<<<<<< HEAD
function create_local(currentUsername,ifDecrypt,password) {                     //creating a local database named as the Decrypted
  var request = indexedDB.open("Decrypted", 1);
  masterPassword=password;
=======
function create_local(currentUsername) {                     //creating a local database named as the Decrypted
  var request = indexedDB.open("Decrypted", 1);
>>>>>>> a1ae630cbb8926c602cbbb7ebdb1b076bc223ad1
  request.onupgradeneeded = function(e) {
    var db = e.target.result;
    e.target.transaction.onerror = local_database.onerror;
    var store = db.createObjectStore(currentUsername,{keyPath: "url"}); //the name of the one and only object store is the   
  };                                                                    //username with key as the site url(unique)
  request.onsuccess = function(e) {
    local_database.db = e.target.result;
    console.log("Created local account");
<<<<<<< HEAD
    if(ifDecrypt){
      var temp1= downloadGlobal(currentUsername,password);
      //if(!temp1)
      //  return 0;
    }
=======
>>>>>>> a1ae630cbb8926c602cbbb7ebdb1b076bc223ad1
  };
  request.onerror = function(e){
    console.log(local_database.onerror);
  };
};

<<<<<<< HEAD
function addItem_local(credential) {
  var db = local_database.db;
  var trans = db.transaction([credential.username], "readwrite");
  var store = trans.objectStore(credential.username);
=======
function addItem_local(credential,username) {
  var db = local_database.db;
  var trans = db.transaction([username], "readwrite");
  var store = trans.objectStore(username);
>>>>>>> a1ae630cbb8926c602cbbb7ebdb1b076bc223ad1
  var request = store.put({
    "username": credential.username,
    "url": credential.url,
    "password": credential.password
  });

  request.onsuccess = function(e){
    console.log("addition successful");
  }
  request.onerror = database.onerror;
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

<<<<<<< HEAD
=======
var JsonFormatter = {
        stringify: function (cipherParams) {
            // create json object with ciphertext
            var jsonObj = {
                ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64)
            };

            // optionally add iv and salt
            if (cipherParams.iv) {
                jsonObj.iv = cipherParams.iv.toString();
            }
            if (cipherParams.salt) {
                jsonObj.s = cipherParams.salt.toString();
            }

            // stringify json object
            return JSON.stringify(jsonObj);
        },

        parse: function (jsonStr) {
            // parse json string
            var jsonObj = JSON.parse(jsonStr);

            // extract ciphertext from json object, and create cipher params object
            var cipherParams = CryptoJS.lib.CipherParams.create({
                ciphertext: CryptoJS.enc.Base64.parse(jsonObj.ct)
            });

            // optionally extract iv and salt
            if (jsonObj.iv) {
                cipherParams.iv = CryptoJS.enc.Hex.parse(jsonObj.iv)
            }
            if (jsonObj.s) {
                cipherParams.salt = CryptoJS.enc.Hex.parse(jsonObj.s)
            }

            return cipherParams;
        }
    };







>>>>>>> a1ae630cbb8926c602cbbb7ebdb1b076bc223ad1
global_database.onerror = function(e) {
  console.error(e.value);
}

<<<<<<< HEAD
function create_global(currentUsername,password) {                  
  storedVersion.storage.versionVal++;                         //update version of the encrypted database
  var request = indexedDB.open("Encrypted",storedVersion.storage.versionVal );//open encrypted database                  
    request.onupgradeneeded = function(e) {                              
    var db1 = e.target.result;
    e.target.transaction.onerror = global_database.onerror;
    var store = db1.createObjectStore(currentUsername,{keyPath: "url"});    //create object store with keypath as url
=======
function create_global(currentUsername,password) {                  //create a object store by user's username with keypath as 
  var request = indexedDB.open("Encrypted", 1);                  //the url storedVersion.storage.versionVal
  storedVersion.storage.versionVal++;                                           //update version of the encrypted database
  request.onupgradeneeded = function(e) {                              //database is named Encrypted 
    var db1 = e.target.result;
    e.target.transaction.onerror = global_database.onerror;
    var store = db1.createObjectStore(currentUsername,{keyPath: "url"});
>>>>>>> a1ae630cbb8926c602cbbb7ebdb1b076bc223ad1
  };
  request.onsuccess = function(e) {
    global_database.db = e.target.result;
    console.log("Created global account");
    var db2 = global_database.db;
    var trans = db2.transaction([currentUsername], "readwrite");
    var store = trans.objectStore(currentUsername);
<<<<<<< HEAD
    var key = crypto.encrypt("JACNJ:rLV!cFC%R/]uyavq^'6]c]/j",password).toString();
    var jsonString = crypto.decrypt(key,password).toString(crypto.decryption);
    var request1 = store.put({
      "username": "null",
      "url": "1",
      "password": key
=======
    var key = crypto.encrypt("JACNJ:rLV!cFC%R/]uyavq^'6]c]/j",password,{ format: JsonFormatter });
    console.log(key);
    /*console.log(key.$super);
    console.log(key.ciphertext);
    console.log(key.key);
    console.log(key.iv);
    console.log(key.algorithm);
    console.log(key.mode);
    console.log(key.padding);
    console.log(key.blockSize);
    console.log(key.formatter);
    console.log(key.salt);*/
    
    var request1 = store.put({
      "username": "null",
      "url": "1",
      "password": crypto.encrypt("JACNJ:rLV!cFC%R/]uyavq^'6]c]/j",password,{ format: JsonFormatter })
>>>>>>> a1ae630cbb8926c602cbbb7ebdb1b076bc223ad1
    });
    request1.onsuccess = function(event){
    console.log("Added public key");
    };
  };
  request.onerror = global_database.onerror;
};

function downloadGlobal(username,password){                //to transfer encrypted data from global to local database
<<<<<<< HEAD
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
  objectStore_global.openCursor().onsuccess = function(event) {
    var cursor = event.target.result;
    if (cursor&&cursor.key!=1) {
      var credential;
      credential.url=crypto.decrypt(cursor.key,password).toString(crypto.decryption);
      credential.username = crypto.decrypt(cursor.value.username,password).toString(crypto.decryption);
      credential.password = crypto.decrypt(cursor.value.password,password).toString(crypto.decryption);
      addItem_local(credential);
=======
  checkKey=find_account(username,password);                //check if account exists and password matches
  if(checkKey==0)                    
  	console.log("No match");
  else
    decryptAll(username,password);                        //if match decrypt all data and add to local store
}

var find_account= function(username,password){                
  var db = global_database.db;
  var trans = db.transaction([username], "readonly");
  trans.onerror = function(event){
    console.log("No match for username");
  }
  var store = trans.objectStore("Username");
  var request = store.get(1);
  request.onsuccess= function(e){
  	  var check_key = crypto.decrypt(request.result.password,password);
  	  if(check_key != "JACNJ:rLV!cFC%R/]uyavq^'6]c]/j")
        return 0;
      else
        return 1;
  };
};

function decryptAll(username,password){                   //to decrypt all data under the username using the password and 
  var db_global = global_database.db;                     //store in local database
  var db_local  = local_database.db;                        
  var objectStore_global = db_global.transaction(username).objectStore(username);
  var objectStore_local = db_local.transaction(username).objectStore(username);
  objectStore_global.openCursor().onsuccess = function(event) {
    var cursor = event.target.result;
    if (cursor) {
      var credential;
      credential.url=crypto.decrypt(cursor.key,password);
      credential.username = crypto.decrypt(cursor.value.username,password);
      credential.password = crypto.decrypt(cursor.value.password,password);
      addItem_local(credential,username);
>>>>>>> a1ae630cbb8926c602cbbb7ebdb1b076bc223ad1
      cursor.continue();
    }
  };
};
 
function deleteLocal(){
<<<<<<< HEAD
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

function search(givenSite){ 
  var flag = false;                    
  var db_local  = local_database.db;                         
  var objectStore_local = db_local.transaction(username).objectStore(username);
  objectStore_local.openCursor().onsuccess = function(event) {
    var cursor = event.target.result;
    if (cursor) {
      if(cursor.key==givenSite)
        flag=true;
      else
        cursor.continue();
    }
  };
  return flag;
}

function addItem_global(credential){
  var db = global_database.db;
  credential.url = crypto.encrypt(credential.url,masterPassword).toString();
  credential.username = crypto.encrypt(credential.username,masterPassword).toString();
  credential.password = crypto.encrypt(credential.password,masterPassword).toString();
  var trans = db.transaction([credential.username], "readwrite");
  var store = trans.objectStore(credential.username);
  var request = store.put({
    "username": credential.username,
    "url": credential.url,
    "password": credential.password
  });

  request.onsuccess = function(e){
    console.log("addition successful");
  }
  request.onerror = database.onerror;
}; 

function addSync(url,username,password){
 var credential;
 credential.url =url;
 credential.username = username;
 credential.password = password;
 addItem_local(credential);
 addItem_global(credential);
}

exports.create_local = create_local;
exports.create_global = create_global;
exports.search = search;
exports.deleteLocal = deleteLocal;
exports.closeGlobal = closeGlobal;
exports.addSync = addSync;
=======
  var request = indexedDB.deleteDatabase("Decrypted");
  request.onsuccess = function(event){
    console.log("Local database deleted");
  }
}

function deleteAll(){
  var request2 = indexedDB.deleteDatabase("Encrypted");
  var request1 = indexedDB.deleteDatabase("Decrypted");
  request2.onsucess = function(e){
    console.log("Global deleted");
  };
  
  request2.onerror = function(e){
    console.log("Error in deleting global");
  };
  request1.onsuccess = function(e){
    console.log("Local deleted");
  };
};

 exports.create_local = create_local;
 exports.create_global = create_global;
 exports.downloadGlobal = downloadGlobal;
 exports.deleteLocal = deleteLocal;
 exports.deleteAll = deleteAll;
>>>>>>> a1ae630cbb8926c602cbbb7ebdb1b076bc223ad1
