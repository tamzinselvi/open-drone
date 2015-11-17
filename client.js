var ODClient = function(host) {
  this.socket = new io.connect(host);
  this.socket.on('ping', function() {
    this.socket.emit('ping');
  });
};

ODClient.prototype.setTargetDZ = function(value) {
  this.socket.emit('set target', {
    measure: "dz",
    value: value
  });
};
