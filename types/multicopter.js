/**
 * The Multicopter type class defines the framework for various multicopters to interface with IO.
 *
 */
var MulticopterType = function(controller) {
  this.controller = controller;
};

module.exports = MulticopterType;

// Supports up to 16 motors for now
var zeroSpeed = function() {
  var zero = {};
  for (var i = 0; i < 16; i++) zero[i] = 0;
  return zero;
};

// Override these methods while defining new types
MulticopterType.prototype.getPitchMotorSpeed = zeroSpeed;
MulticopterType.prototype.getYawMotorSpeed = zeroSpeed;
MulticopterType.prototype.getRollMotorSpeed = zeroSpeed;
MulticopterType.prototype.getDXMotorSpeed = zeroSpeed;
MulticopterType.prototype.getDYMotorSpeed = zeroSpeed;
MulticopterType.prototype.getDZMotorSpeed = zeroSpeed;
MulticopterType.prototype.getAltitudeMotorSpeed = zeroSpeed;

MulticopterType.prototype.update = function(callback) {
  function addMotorSpeeds(s1, s2) {
    for (var i in s1) s1[i] = s1[i] + s2[i];
  }

  // Combine motor speeds
  var motorSpeed = this.getPitchMotorSpeed();
  addMotorSpeeds(motorSpeed, this.getYawMotorSpeed());
  addMotorSpeeds(motorSpeed, this.getRollMotorSpeed());
  addMotorSpeeds(motorSpeed, this.getDXMotorSpeed());
  addMotorSpeeds(motorSpeed, this.getDYMotorSpeed());
  addMotorSpeeds(motorSpeed, this.getDZMotorSpeed());
  addMotorSpeeds(motorSpeed, this.getAltitudeMotorSpeed());
  this.setMotorSpeed(motorSpeed, callback);
};

MulticopterType.prototype.setMotorSpeed = function (motorSpeed, callback) {
  this.controller.setMotorSpeed(motorSpeed, callback);
};
