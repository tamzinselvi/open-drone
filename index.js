var Types = require("./types");
var Motors = require("./motors");

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
  if (!options) options = this.defaultOptions;
  else if (typeof(options) === "object") for (var i in this.defaultOptions) if (!options[i]) options[i] = this.defaultOptions;
  else throw new TypeError("Invalid type for options argument in ODController constructor, type provided: " + typeof(options));
  this.type = new options.type(this);
  this.motors = motors;
  this.sensometer = sensometer;
};

module.exports = ODController;

ODController.defaultOptions = {
  type: Types.Quadcopter
};

ODController.prototype.start = function () {
  for (var i in motorSpeed) this.motors[i].start();
};

ODController.prototype.stop = function () {
  for (var i in motorSpeed) this.motors[i].stop();
};

ODController.prototype.setMotorSpeed = function (motorSpeed) {
  for (var i in motorSpeed) this.motors[i].setW(motorSpeed[i]);
};
