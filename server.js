var ODServer = function(io, controller) {
  var _this = this;
  io.on('connection', function(socket) {
    function pingLoop() {
      _this.ping = false;
      socket.emit('ping');
      setTimeout(function() {
        if (_this.ping === false) {
          this.controller.setDefaultTargets();
        }
        pingLoop();
      }, 500);
    }

    socket.on('set target', this.setTarget);
    socket.on('ping', function() {
      _this.ping = true;
    });
    pingLoop();
  });
  this.io = io;
  this.controller = controller;
};

module.exports = ODServer;

ODServer.prototype.setTarget = function(data) {
  if (data.measure == "dz") {
    this.controller.setTargetDZ(data.value);
  }
};
