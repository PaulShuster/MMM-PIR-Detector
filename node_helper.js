'use strict';

/* Magic Mirror
 * Module: MMM-PIR-Detector
 *
 * Based on MMM-PIR-Sensor (modified to minimize dependencies)
 * By Paul-Vincent Roll http://paulvincentroll.com
 * MIT Licensed.
 */

const NodeHelper = require('node_helper');
const PiGpio = require('pi-gpio');
//const exec = require('child_process').exec;

module.exports = NodeHelper.create({
  start: function () {
    this.started = false;
  },

  activateMonitor: function () {
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
    setTimeout(self.pollPin, 1000, self);
    var x = PiGpio.read(22);
    if (x === 1) self.activateMonitor(); else self.deactivateMonitor();
    //PiGpio.open(22, function() {
    //  var x = PiGpio.read(22, function() {PiGpio.close(22);});
    //  if (x === 1) self.activateMonitor(); else self.deactivateMonitor();
    //});
    
  },

  // Subclass socketNotificationReceived received.
  socketNotificationReceived: function(notification, payload) {
    
    if (notification === 'CONFIG' && this.started == false) {
      const self = this;
      this.config = payload;
      setTimeout(self.pollPin, 1000, self);

      //Setup pins
      //this.pir = new Gpio(this.config.sensorPIN, 'in', 'both');
      // exec("echo '" + this.config.sensorPIN.toString() + "' > /sys/class/gpio/export", null);
      // exec("echo 'in' > /sys/class/gpio/gpio" + this.config.sensorPIN.toString() + "/direction", null);

      //Detected movement
      /*
      this.pir.watch(function(err, value) {
        if (value == 1) {
          self.sendSocketNotification("USER_PRESENCE", true);
          if (self.config.powerSaving){
            self.activateMonitor();
          }
         }
        else if (value == 0) {
          self.sendSocketNotification("USER_PRESENCE", false);
          if (self.config.powerSaving){
            self.deactivateMonitor();
          }
        }
      });*/

      this.activateMonitor();
      this.started = true;

    } else if (notification === 'SCREEN_WAKEUP') {
      this.activateMonitor();
    }
  }

});
