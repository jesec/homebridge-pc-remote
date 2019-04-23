let Homebridge;
let Device  = require('./lib/device');

const PLUGIN_NAME   = 'homebridge-samsung-tizen';
const PLATFORM_NAME = 'SamsungTizen';

module.exports = (homebridge) => {
    Homebridge = homebridge;
    Homebridge.registerPlatform(PLUGIN_NAME, PLATFORM_NAME, SamsungPlatform);
}

class SamsungPlatform {
    constructor(log, config, api) {
        if (!config) { return; }

        this.log     = log;
        this.api     = api;

        this.config = {
            delay   : config.delay,
            keys    : config.keys || {},
            inputs  : config.inputs || [],
            devices : config.devices || [],
            method  : config.method,
            refresh : config.refresh,
            timeout : config.timeout
        };
    }

    accessories(callback) {
        let accessories = [];

        for (let device of this.config.devices) {
            device = new Device(this, Homebridge.hap, device);

            // Add the new device accessories to the list
            accessories = [
                ...accessories,
                ...device.accessories
            ];
        }

        // Return the accessories
        callback(accessories);
    }
}