var ODClient = function(socket) {
  var _this = this;
  this.socket = socket;
  this.socket.on('ping', function() {
    _this.socket.emit('ping');
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
