'use strict';

/* Magic Mirror
 * Module: MMM-PIR-Detector
 *
 * Based on MMM-PIR-Sensor (modified to minimize dependencies)
 * By Paul-Vincent Roll http://paulvincentroll.com
 * MIT Licensed.
 */

const NodeHelper = require('node_helper');
const Gpio = require('onoff').Gpio;
//const PiGpio = require('pi-gpio');
//const exec = require('child_process').exec;

module.exports = NodeHelper.create({
  start: function () {
    this.started = false;
    this.isActive = true;
    this.motionCounter = 0;
  },
  
  activateMonitor: function () {
    console.log("Activate");
    this.motionCounter++;
    var currentCounter = this.motionCounter;
    setTimeout(function(self) { 
      console.log("self: " + self.motionCounter + "    local: " + currentCounter);
      if (self.motionCounter === currentCounter) { self.deactivateMonitor(); } 
    }, 5000, this);
          
    if (this.isActive) return;
    this.isActive = true;
    this.sendSocketNotification("SCREEN_ON");
    /*
    if (this.config.relayPIN != false) {
      this.relay.writeSync(this.config.relayOnState);
    }
    else if (this.config.relayPIN == false){
      exec("/opt/vc/bin/tvservice --preferred && sudo chvt 6 && sudo chvt 7", null);
    }
    */
  },

  deactivateMonitor: function () {
    if (!this.isActive) return;
    this.isActive = false;
    this.sendSocketNotification("SCREEN_OFF");
    /*
    if (this.config.relayPIN != false) {
      this.relay.writeSync(this.config.relayOffState);
    }
    else if (this.config.relayPIN == false){
      exec("/opt/vc/bin/tvservice -o", null);
    }
    */
  },
        
  pollPin: function(self) {
    setTimeout(self.pollPin, 100, self);
    self.pir.read(function(err, value) {
      if (value === 1) self.activateMonitor();
    });
    /*
    PiGpio.open(15, "input", function(err) {
      console.log("Opening pin (" + err + ")");
      PiGpio.read(15, function(err, val) {
        console.log("Reading pin (" + err + "): " + val);
        if (val === 1) self.activateMonitor(); else self.deactivateMonitor();
        PiGpio.close(15, function(err) {
          console.log("Opening pin (" + err + ")");
        });
      });
    });*/
  },
   
  // Subclass socketNotificationReceived received.
  socketNotificationReceived: function(notification, payload) {
    
    if (notification === 'CONFIG' && this.started == false) {
      const self = this;
      this.config = payload;
      this.activateMonitor();

      //Setup pins
      this.pir = new Gpio(this.config.pirPIN, 'in');
      setTimeout(self.pollPin, 1000, self);
      // exec("echo '" + this.config.sensorPIN.toString() + "' > /sys/class/gpio/export", null);
      // exec("echo 'in' > /sys/class/gpio/gpio" + this.config.sensorPIN.toString() + "/direction", null);

      //Detected movement
      //this.pir.watch(function(err, value) {
      //  if (value == 1) { 
      //    self.activateMonitor();
      //  }
      //});

      this.started = true;

    } else if (notification === 'SCREEN_WAKEUP') {
      this.activateMonitor();
    }
  }

});
