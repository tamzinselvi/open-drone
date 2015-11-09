var RPIOMotor = require("../motors").RPIOMotor;
var Readline = require('readline');

var motor = new RPIOMotor();

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
    if (a.toUpperCase() == "W") motor.increaseW();
    else if (a.toUpperCase() == "S") motor.decreaseW();
    else if (a.toUpperCase() == "Q") {
      motor.stop();
      rl.close();
      process.exit(0);
    }
  });
}

yn("Before we calbirate, is this a bi-drectional motor? (Y/N)", function(bidirectional) {
  motor.bidirecitonal = bidirectional;
  readline.question("Disconnect your ESC from power and press ENTER", function() {
    motor.start();
    motor.setW(100);
    console.log("Connect your ESC to your power source");
    readline.question("After you hear *BEEP BEEP* press ENTER", function() {
      function calibrateCentral() {
        motor.setW(0);
        readline("After some more *BEEP BEEP* have finished, press ENTER", ready);
      }
      if (bidirectional) {
        motor.setW(-100);
        readline("After some more *BEEP BEEP* have finished, press ENTER", calibrateCentral);
      }
      else calibrateCentral();
    });
  });
});
