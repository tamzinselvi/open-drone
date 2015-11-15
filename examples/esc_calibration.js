var RPIOMotor = require("../motors").RPIOMotor;
var Readline = require('readline');

var motor;

var readline = Readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function yn(q, f) {
  function qf() {
    readline.question(q, function(a) {
      if (a.toUpperCase() == "Y") f(true);
      else if (a.toUpperCase() == "N") f(false);
      else qf();
    });
  }
  qf();
}

function ready() {
  console.log("Increase > w");
  console.log("Decrease > s");
  console.log("Quit > q");
  readline.question("", function(a) {
    if (a.toUpperCase() == "W") {
      motor.increaseW();
      ready();
    }
    else if (a.toUpperCase() == "S") {
      motor.decreaseW();
      ready();
    }
    else if (a.toUpperCase() == "Q") {
      motor.stop();
      readline.close();
      process.exit(0);
    }
    else {
      if (Number.isInteger(Number.parseInt(a))) motor.setW(Number.parseInt(a));
      else console.log("Invalid entry!");
      ready();
    }
  });
}

readline.question("Which GPIO pin are we using?", function(gpio) {
  motor = new RPIOMotor("", Number.parseInt(gpio));
  yn("Should we initialize the ESC? (Y/n)", function(init) {
    if (init) readline.question("Disconnect your ESC from power and press ENTER", function() {
      motor.setW(100);
      console.log("Connect your ESC to your power source");
      readline.question("After you hear *BEEP BEEP* press ENTER", function() {
        motor.setW(0);
        readline.question("After some more *BEEP BEEP* have finished, press ENTER", ready);
      });
    });
    else ready();
  });
});
