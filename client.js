var ODClient = function(socket) {
  this.socket = socket;
  this.socket.on('ping', function() {
    this.socket.emit('ping');
  });
};

module.exports = ODClient;

ODClient.prototype.stop = function() {
  this.socket.emit('stop');
};

ODClient.prototype.start = function() {
  this.socket.emit('start');
};

ODClient.prototype.setTargetDZ = function(value) {
  this.socket.emit('set target', {
    measure: "dz",
    value: value
  });
};
