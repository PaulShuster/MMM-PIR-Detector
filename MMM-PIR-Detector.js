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
	},


	// Override socket notification handler.
	socketNotificationReceived: function(notification, payload) {
		if (notification === "USER_PRESENCE"){
			this.sendNotification(notification, payload)
		}
	},

	notificationReceived: function(notification, payload) {
		if (notification === "SCREEN_WAKEUP"){
			this.sendNotification(notification, payload)
		}
	},

	getDom: function() {
		var wrapper = document.createElement("div");
		wrapper.innerHTML = "Testing this out";
		return wrapper;
	}

	start: function() {
		if (this.config.relayOnState == 1){
			this.config.relayOffState = 0
		}
		else if (this.config.relayOnState == 0){
			this.config.relayOffState = 1
		}
		this.sendSocketNotification('CONFIG', this.config);
		Log.info('Starting module: ' + this.name);
	}
});