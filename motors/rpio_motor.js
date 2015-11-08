var RPIO = require('rpio');
RPIO.pwmSetClockDivider(8); // 2.4MHz

/**
 * RPIO motor implementation using node-rpio.
 *
 */
var RPIOMotor = function (name, pin, minWidth, maxWidth, startup) {
  // Defaults
  if (!name) name = "Unnamed Motor";
  if (!pin) pin = 12;
  if (!minWidth) minWidth = 1024;
  if (!maxWidth) maxWidth = 2048;
  if (!startup) startup = 5000; // 5000ms start

  this.name = name;
  this.pin = pin;
  this.minWidth = minWidth;
  this.maxWidth = maxWidth;
  this.startup = startup;
  this.W = 0;
};

module.exports = RPIOMotor;

RPIOMotor.prototype.start = function (callback) {
  var t = 0;
  var pin = this.pin;
  var minWidth = this.minWidth;
  RPIO.setFunction(pin, RPIO.PWM);
  RPIO.pwmSetRange(pin, maxWidth);
  (function interval () {
    RPIO.pwmSetData(pin, minWidth * Math.pow(2, 10 * (t/startup - 1)));
    if (t < startup) {
      t += 5;
      setInterval(interval, 5);
    } else callback();
  })();
};

RPIOMotor.prototype.stop = function () {
  this.W = 0;
  RPIO.setFunction(this.pin, RPIO.INPUT);
};

RPIOMotor.prototype.setW = function(W) {
  this.W = Math.min(100, Math.max(0, W));
  RPIO.pwmSetData(this.pin, minWidth + (maxWidth - minWidth) * this.W / 100);
};
