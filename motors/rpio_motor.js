var RPIO = require('rpio');
RPIO.setMode('gpio');
RPIO.pwmSetClockDivider(8); // 2.4MHz

/**
 * RPIO motor implementation using node-rpio.
 *
 */
var RPIOMotor = function (name, pin, minWidth, maxWidth, bidirectional) {
  // Defaults
  if (!name) name = "Unnamed Motor";
  if (!pin) pin = 12;
  if (!minWidth) minWidth = 1000;
  if (!maxWidth) maxWidth = 2000;
  if (!bidirectional) bidirectional = false;

  this.name = name;
  this.pin = pin;
  this.minWidth = minWidth;
  this.maxWidth = maxWidth;
  this.bidirectional = bidirectional;
  this.W = 0;
};

module.exports = RPIOMotor;

RPIOMotor.prototype.start = function (callback) {
  this.W = 0;
  RPIO.setFunction(this.pin, RPIO.PWM);
  RPIO.pwmSetRange(this.pin, this.maxWidth);
  RPIO.pwmSetData(this.pin, this.minWidth + (this.maxWidth - this.minWidth) / 2);
};

RPIOMotor.prototype.stop = function () {
  this.W = 0;
  RPIO.setFunction(this.pin, RPIO.INPUT);
};

RPIOMotor.prototype.setW = function(W) {
  this.W = Math.min(100, Math.max(this.bidirectional ? -100 : 0, W));
  RPIO.pwmSetData(this.pin, this.minWidth + ((this.maxWidth - this.minWidth) / 2) * (1 + this.W/100));
};

RPIOMotor.prototype.increaseW = function(step) {
  if (!step) step = 1;
  this.setW(this.W + step);
};

RPIOMotor.prototype.decreaseW = function(step) {
  if (!step) step = 1;
  this.setW(this.W - step);
};
