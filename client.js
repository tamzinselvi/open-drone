var ODClient = function(socket) {
  var _this = this;
  this.socket = socket;
  this.socket.on('ping', function() {
    console.log('ping received');
    _this.socket.emit('ping');
    console.log('ping sent');
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

ODClient.prototype.setTargetPitch = function(value) {
  this.socket.emit('set target', {
    measure: "pitch",
    value: value
  });
};

ODClient.prototype.setTargetRoll = function(value) {
  this.socket.emit('set target', {
    measure: "roll",
    value: value
  });
};
