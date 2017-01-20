/* global Module */

/* Magic Mirror
 * Module: MMM-PIR-Detector
 *
 * Based on MMM-PIR-Sensor (modified to minimize dependencies)
 * By Paul-Vincent Roll http://paulvincentroll.com
 * MIT Licensed.
 */

Module.register('MMM-PIR-Detector',{

  defaults: {
    pirPIN: 22,
    powerSaving: true,
    relayOnState: 1,
    text: "Screen On"
  },
 
  displayText: "Starting",

  // Override socket notification handler.
  socketNotificationReceived: function(notification, payload) {
    if (notification === "SCREEN_ON"){
      this.displayText = "Screen On";
    }
    if (notification === "SCREEN_OFF"){
      this.displayText = "Screen Off";
    }
    this.updateDom(1000);
  },

  getDom: function() {
    var wrapper = document.createElement("div");
    wrapper.innerHTML = "PIR: " + this.displayText;
    return wrapper;
  },

  start: function() {
    this.sendSocketNotification('CONFIG', this.config);
    Log.info('Starting module: ' + this.name);
  }
});