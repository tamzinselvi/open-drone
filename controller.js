var Types = require("./types");

var async = require('async');

/**
 * The core to the open-drone system.  The ODController controls a UAV (in the future multiple), providing an interface
 * for a clientss to connect in for remote control.
 *
 * The initial target is a single Quadcopter type Multicopter, using PID controllers to help manage IO with a client interface.
 *
 * Requirements:
 *  - a UAV with an onboard computer (Pi A+)
 *  - interface with motors
 *  - interface with sensometer (gyro, accelerometer, altitude)
 *
 * Motor interface (motors):
 *  Object {
 *    0: Motor
 *    1: Motor
 *    2: Motor
 *    ...
 *  }
 *
 * Sensometer interface (sensometer):
 *  Object {
 *    pitch: Function()
 *    yaw: Function()
 *    roll: Function()
 *    dx: Function()
 *    dy: Function()
 *    dz: Function()
 *    altitude: Function()
 * }
 *
 */
var ODController = function (motors, sensometer, options) {
  if (!options) options = ODController.defaultOptions;
  else if (typeof(options) === "object") for (var i in ODController.defaultOptions) if (!options[i]) options[i] = ODController.defaultOptions;
  else throw new TypeError("Invalid type for options argument in ODController constructor, type provided: " + typeof(options));
  this.type = new options.type(this);
  this.motors = motors;
  this.sensometer = sensometer;
  this.setTargetDZ(options.targetDZ);
};

module.exports = ODController;

ODController.defaultOptions = {
  type: Types.QuadcopterX,
  targetDZ: 0
};

ODController.prototype.stop = function () {
  for (var i in motorSpeed) this.motors[i].stop();
};

ODController.prototype.setDefaultTargets = function () {

};

ODController.prototype.setTargetDZ = function (dz) {
  this.targetDZ = dz;
  this.type.dzPIDController.setTarget(dz);
};

ODController.prototype.setMotorSpeed = function (motorSpeed, callback) {
  var _this = this;
  var pl = [];
  // async helper function for 
  var sf = function(i) {
    return function(callback) {
      _this.motors[i].setW(motorSpeed[i], callback);
    };
  };
  for (var i in motorSpeed) pl[i] = sf(i);
  async.parallel(pl, callback);
};

ODController.prototype.update = function(callback) {
  var _this = this;
  _this.sensometer.update(function() {
    _this.type.update(callback);
  });
};
