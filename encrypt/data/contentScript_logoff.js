window.onbeforeunload = function(event){
  self.port.emit("closingWindow","1");
  self.port.on("closed",function(e){});
};
