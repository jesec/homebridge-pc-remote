module.exports = class Television {
    constructor(accessory) {
        this.robot = require("robotjs");

        this.accessory  = accessory;
        this.hap        = accessory.hap;
        this.device     = accessory.device;
        this.remoteKeys = require('../options/remote')(this.device);

        this.createService();
    }

    getValue() {
        this.service.getCharacteristic(this.hap.Characteristic.Active).getValue();
    }

    updateValue(value, characteristic) {
        this.service.getCharacteristic(characteristic || this.hap.Characteristic.Active).updateValue(value);
    }

    addLinkedService(newLinkedService) {
        return this.service.addLinkedService(newLinkedService);
    }

    getServices() {
        return [this.service];
    }

    createService() {
        this.service = new this.hap.Service.Television(this.accessory.name)
            .setCharacteristic(this.hap.Characteristic.ConfiguredName, this.accessory.name)
            .setCharacteristic(this.hap.Characteristic.SleepDiscoveryMode, this.hap.Characteristic.SleepDiscoveryMode.ALWAYS_DISCOVERABLE);

        this.service.getCharacteristic(this.hap.Characteristic.Active)
            .on('get', this.getActive.bind(this))
            .on('set', this.setActive.bind(this));

        this.service.getCharacteristic(this.hap.Characteristic.RemoteKey)
            .on('set', this.setRemote.bind(this));

        this.service.getCharacteristic(this.hap.Characteristic.ActiveIdentifier)
            .on('get', this.getInput.bind(this))
            .on('set', this.setInput.bind(this));
    }

    getActive(callback) {
        callback(null, 1);
    }

    setActive(value, callback) {
        if (!value) {
            var turnOffDisplay = require("turn-off-display");
            turnOffDisplay();
        }
        callback();
    }

    setRemote(value, callback) {
        this.robot.keyTap(this.remoteKeys[value]);
        callback(null, true);
    }

    getInput(callback) {
        this.accessory.services.inputs.getInput().then(identifier => {
            this.updateValue(identifier ? identifier : 0, this.hap.Characteristic.ActiveIdentifier);

            callback();
        }).catch(error => {
            this.device.debug(error.stack);

            callback();
        });
    }

    setInput(value, callback) {
        this.accessory.services.inputs.setInput(value).then(() => {
            callback();
        }).catch(error => {
            this.device.debug(error.stack);

            callback();
        });
    }
}