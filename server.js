var ODServer = function(io, controller) {
  var _this = this;
  io.on('connection', function(socket) {
    console.log("client connected");
    function pingLoop() {
      _this.ping = false;
      socket.emit('ping');
      setTimeout(function() {
        if (_this.ping === false) {
          _this.controller.setDefaultTargets();
        }
        pingLoop();
      }, 500);
    }

    socket.on('set target', function(data) {
      _this.setTarget(data);
    });
    socket.on('stop', function() {
      _this.controller.stop();
      socket.emit("stop");
    });
    socket.on('start', function() {
      _this.controller.start();
      socket.emit("start");
    });
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
