var RPIOMotor = require('../motors').RPIOMotor;
var BerryIMU = require('node-berryimu');
var ODController = require('../');
var motors = {
  0: new RPIOMotor("FL", 17),
  1: new RPIOMotor("FR", 8),
  2: new RPIOMotor("BR", 12),
  3: new RPIOMotor("BL", 11)
};
for (var i in motors) motors[i].setW(1);
setTimeout(function() {
  for (var i in motors) motors[i].setW(0);
  var sensometer = new BerryIMU();
  sensometer.initialize(function() {
    var controller = new ODController(motors, sensometer);
    require('async').whilst(function() {
      return true;
    }, function(callback) {
      controller.update(callback);
    });
  });
}, 1000);
