var MulticopterType = require("./multicopter");
var PIDController = require("node-pid-controller");

/**
 * Another popular form of the quadrotor.
 *
 *            FRONT
 *
 *        (00)     (01)
 *           \\    //
 *            \\__//
 *  LEFT      | __ |      RIGHT
 *            //  \\
 *           //    \\
 *        (03)     (02)
 *
 *             BACK
 *
 * Motor 00: CW  | +Y / +Pitch -Roll +Yaw
 * Motor 01: CCW | +X / +Pitch +Roll -Yaw
 * Motor 02: CW  | -X / -Pitch +Roll +Yaw
 * Motor 03: CCW | -Y / -Pitch -Roll -Yaw
 *
 */
var QuadcopterXType = function() { 
  MulticopterType.apply(this, arguments);
};

QuadcopterXType.prototype = new MulticopterType();

QuadcopterXType.prototype.constructor = QuadcopterXType;

module.exports = QuadcopterXType;

// Setup PID controllers
QuadcopterXType.prototype.pitchPIDController = new PIDController(0, 0, 0);
QuadcopterXType.prototype.yawPIDController = new PIDController(0, 0, 0);
QuadcopterXType.prototype.rollPIDController = new PIDController(0, 0, 0);
QuadcopterXType.prototype.dxPIDController = new PIDController(0, 0, 0);
QuadcopterXType.prototype.dyPIDController = new PIDController(0, 0, 0);
QuadcopterXType.prototype.dzPIDController = new PIDController(0.03, 0, 0);
QuadcopterXType.prototype.altitudePIDController = new PIDController(0, 0, 0);

// Motor speed functions, updates PID
QuadcopterXType.prototype.getPitchMotorSpeed = function() {
  var pitchAdjust = this.pitchPIDController.update(this.controller.sensometer.pitch);
  return {
    0: pitchAdjust,
    1: pitchAdjust,
    2: -pitchAdjust,
    3: -pitchAdjust
  };
};

QuadcopterXType.prototype.getYawMotorSpeed = function() {
  var yawAdjust = this.yawPIDController.update(this.controller.sensometer.yaw);
  return {
    0: yawAdjust,
    1: -yawAdjust,
    2: yawAdjust,
    3: -yawAdjust
  };
};

QuadcopterXType.prototype.getRollMotorSpeed = function() {
  var rollAdjust = this.rollPIDController.update(this.controller.sensometer.roll);
  return {
    0: -rollAdjust,
    1: rollAdjust,
    2: rollAdjust,
    3: -rollAdjust
  };
};

// Disable these two for now
// QuadcopterXType.prototype.getDXMotorSpeed = zeroSpeed;
// QuadcopterXType.prototype.getDYMotorSpeed = zeroSpeed;

QuadcopterXType.prototype.getDZMotorSpeed = function() {
  var dzAdjust = this.dzPIDController.update(this.controller.sensometer.accelerometer.z);
  return {
    0: dzAdjust,
    1: dzAdjust,
    2: dzAdjust,
    3: dzAdjust
  };
};

QuadcopterXType.prototype.getAltitudeMotorSpeed = function() {
  var altitudeAdjust = this.altitudePIDController.update(this.controller.sensometer.barometer.pressure); // need to calculate altitude for this
  return {
    0: altitudeAdjust,
    1: altitudeAdjust,
    2: altitudeAdjust,
    3: altitudeAdjust
  };
};
