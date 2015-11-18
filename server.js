var ODServer = function(io, controller) {
  var _this = this;
  io.on('connection', function(socket) {
    console.log("client connected");
    socket.emit('motor status', _this.controller.active);
    // function pingLoop() {
      // _this.ping = false;
      // socket.emit('ping');
      // console.log('ping sent');
      // setTimeout(function() {
        // if (_this.ping === false) {
          // console.log('ping not received, setting default targets');
          // _this.controller.setDefaultTargets();
        // }
        // pingLoop();
      // }, 2000);
    // }

    socket.on('disconnect', function() {
      console.log("client disconnected, restoring default targets");
      _this.controller.setDefaultTargets();
    });

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
      console.log('ping received');
      _this.ping = true;
    });

    // pingLoop();
  });
  this.io = io;
  this.controller = controller;
};

module.exports = ODServer;

ODServer.prototype.setTarget = function(data) {
  if (data.measure == "dz")
    this.controller.setTargetDZ(data.value);
  else if (data.measure == "pitch")
    this.controller.setTargetPitch(data.value);
  else if (data.measure == "roll")
    this.controller.setTargetRoll(data.value);
};
