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
  if (!options) options = {};
  if (typeof(options) === "object") for (var i in ODController.defaultOptions) if (!options[i]) options[i] = ODController.defaultOptions;
  else throw new TypeError("Invalid type for options argument in ODController constructor, type provided: " + typeof(options));
  this.options = options;
  this.type = new options.type(this);
  this.motors = motors;
  this.sensometer = sensometer;
  this.setDefaultTargets();
  this.active = false;
};

module.exports = ODController;

ODController.defaultOptions = {
  type: Types.QuadcopterX,
  targetDZ: 0,
  targetPitch: 180,
  targetRoll: 180
};

ODController.prototype.start = function () {
  this.active = true;
};

ODController.prototype.stop = function () {
  this.active = false;
};

ODController.prototype.setDefaultTargets = function () {
  this.setTargetDZ(this.options.targetDZ);
  this.setTargetPitch(this.options.targetPitch);
  this.setTargetRoll(this.options.targetRoll);
};

ODController.prototype.setTargetDZ = function (dz) {
  this.targetDZ = dz;
  this.type.dzPIDController.setTarget(dz);
};

ODController.prototype.setTargetPitch = function (pitch) {
  this.targetPitch = pitch;
  this.type.pitchPIDController.setTarget(pitch);
};

ODController.prototype.setTargetRoll = function (roll) {
  this.targetRoll = roll;
  this.type.rollPIDController.setTarget(roll);
};

ODController.prototype.setMotorSpeed = function (motorSpeed, callback) {
  if (!this.active) for (var y in motorSpeed) motorSpeed[y] = 0;
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
