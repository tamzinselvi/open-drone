var MulticopterType = require("./multicopter");
var PIDController = require("node-pid-controller");

/**
 * Standard Quadcopter build.
 *
 *            FRONT
 *
 *             (00)
 *              ||
 *              ||
 *  LEFT (03)===  ===(01) RIGHT
 *              ||
 *              ||
 *             (02)
 *
 *             BACK
 *
 * Motor 00: CW  | +Y / +Pitch
 * Motor 01: CCW | +X / +Roll
 * Motor 02: CW  | -X / -Roll
 * Motor 03: CCW | -Y / -Pitch
 *
 */
var QuadcopterType = Object.create(MulticopterType);

// Setup PID controllers
QuadcopterType.prototype.pitchPIDController = new PIDController(1, 0, 0);
QuadcopterType.prototype.yawPIDController = new PIDController(1, 0, 0);
QuadcopterType.prototype.rollPIDController = new PIDController(1, 0, 0);
QuadcopterType.prototype.dxPIDController = new PIDController(1, 0, 0);
QuadcopterType.prototype.dyPIDController = new PIDController(1, 0, 0);
QuadcopterType.prototype.dzPIDController = new PIDController(1, 0, 0);
QuadcopterType.prototype.altitudePIDController = new PIDController(1, 0, 0);

// Motor speed functions, updates PID
QuadcopterType.prototype.getPitchMotorSpeed = function() {
  var pitchAdjust = this.pitchPIDController.update(this.controller.sensometer.pitch());
  return {
    0: pitchAdjust,
    1: 0,
    2: -pitchAdjust,
    3: 0
  };
};

QuadcopterType.prototype.getYawMotorSpeed = function() {
  var yawAdjust = this.yawPIDController.update(this.controller.sensometer.yaw());
  return {
    0: yawAdjust,
    1: yawAdjust,
    2: -yawAdjust,
    3: -yawAdjust
  };
};

QuadcopterType.prototype.getRollMotorSpeed = function() {
  var rollAdjust = this.rollPIDController.update(this.controller.sensometer.roll());
  return {
    0: 0,
    1: rollAdjust,
    2: 0,
    3: -rollAdjust
  };
};

// Disable these two for now
// QuadcopterType.prototype.getDXMotorSpeed = zeroSpeed;
// QuadcopterType.prototype.getDYMotorSpeed = zeroSpeed;

QuadcopterType.prototype.getDZMotorSpeed = function() {
  var dzAdjust = this.dzPIDController.update(this.controller.sensometer.dz());
  return {
    0: dzAdjust,
    1: dzAdjust,
    2: dzAdjust,
    3: dzAdjust
  };
};

QuadcopterType.prototype.getAltitudeMotorSpeed = function() {
  var altitudeAdjust = this.altitudePIDController.update(this.controller.sensometer.altitude());
  return {
    0: altitudeAdjust,
    1: altitudeAdjust,
    2: altitudeAdjust,
    3: altitudeAdjust
  };
};
