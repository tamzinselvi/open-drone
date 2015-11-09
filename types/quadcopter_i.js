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
 * Motor 00: CW  | +Y / +Pitch +Yaw
 * Motor 01: CCW | +X / +Roll -Yaw
 * Motor 02: CW  | -X / -Roll +Yaw
 * Motor 03: CCW | -Y / -Pitch -Yaw
 *
 */
var QuadcopterIType = Object.create(MulticopterType);

// Setup PID controllers
QuadcopterIType.prototype.pitchPIDController = new PIDController(1, 0, 0);
QuadcopterIType.prototype.yawPIDController = new PIDController(1, 0, 0);
QuadcopterIType.prototype.rollPIDController = new PIDController(1, 0, 0);
QuadcopterIType.prototype.dxPIDController = new PIDController(1, 0, 0);
QuadcopterIType.prototype.dyPIDController = new PIDController(1, 0, 0);
QuadcopterIType.prototype.dzPIDController = new PIDController(1, 0, 0);
QuadcopterIType.prototype.altitudePIDController = new PIDController(1, 0, 0);

// Motor speed functions, updates PID
QuadcopterIType.prototype.getPitchMotorSpeed = function() {
  var pitchAdjust = this.pitchPIDController.update(this.controller.sensometer.pitch());
  return {
    0: pitchAdjust,
    1: 0,
    2: -pitchAdjust,
    3: 0
  };
};

QuadcopterIType.prototype.getYawMotorSpeed = function() {
  var yawAdjust = this.yawPIDController.update(this.controller.sensometer.yaw());
  return {
    0: yawAdjust,
    1: -yawAdjust,
    2: yawAdjust,
    3: -yawAdjust
  };
};

QuadcopterIType.prototype.getRollMotorSpeed = function() {
  var rollAdjust = this.rollPIDController.update(this.controller.sensometer.roll());
  return {
    0: 0,
    1: rollAdjust,
    2: 0,
    3: -rollAdjust
  };
};

// Disable these two for now
// QuadcopterIType.prototype.getDXMotorSpeed = zeroSpeed;
// QuadcopterIType.prototype.getDYMotorSpeed = zeroSpeed;

QuadcopterIType.prototype.getDZMotorSpeed = function() {
  var dzAdjust = this.dzPIDController.update(this.controller.sensometer.dz());
  return {
    0: dzAdjust,
    1: dzAdjust,
    2: dzAdjust,
    3: dzAdjust
  };
};

QuadcopterIType.prototype.getAltitudeMotorSpeed = function() {
  var altitudeAdjust = this.altitudePIDController.update(this.controller.sensometer.altitude());
  return {
    0: altitudeAdjust,
    1: altitudeAdjust,
    2: altitudeAdjust,
    3: altitudeAdjust
  };
};
