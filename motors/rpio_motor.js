var RPIO = require('rpio');
RPIO.pwmSetClockDivider(8); // 2.4MHz

/**
 * RPIO motor implementation using node-rpio.
 *
 */
var RPIOMotor = function (name, pin, minWidth, maxWidth, bidirectional) {
  // Defaults
  if (name === null) name = "Unnamed Motor";
  if (pin === null) pin = 12;
  if (minWidth === null) minWidth = 1000;
  if (maxWidth === null) maxWidth = 2000;
  if (bidirectional === null) bidirectional = false;

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
  RPIO.pwmSetRange(this.pin, maxWidth);
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
  if (step === null) step = 1;
  this.setW(this.W + step);
};

RPIOMotor.prototype.decreaseW = function(step) {
  if (step === null) step = 1;
  this.setW(this.W - step);
};
