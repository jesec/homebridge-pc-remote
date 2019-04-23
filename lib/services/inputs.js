const { InvalidInputTypeError } = require('../errors');

module.exports = class Inputs {
    constructor(accessory) {
        this.hap    = accessory.hap;
        this.device = accessory.device;
        this.inputs = accessory.config.inputs;

        this.services = {};

        this.createServices();
    }

    getServices() {
        return Object.values(this.services);
    }

    createServices() {
        for (let index in this.inputs) {
            let identifier = parseInt(index) + 1;

            this.inputs[index].identifier = identifier;

            var name = this.inputs[index].name;

            this.services[identifier] = new this.hap.Service.InputSource(this.inputs[index].name, 'input_' + identifier)
                .setCharacteristic(this.hap.Characteristic.Identifier, identifier)
                .setCharacteristic(this.hap.Characteristic.ConfiguredName, this.inputs[index].name)
                .setCharacteristic(this.hap.Characteristic.IsConfigured, this.hap.Characteristic.IsConfigured.CONFIGURED)
                .setCharacteristic(this.hap.Characteristic.InputSourceType, this.hap.Characteristic.InputSourceType.APPLICATION)
                .setCharacteristic(this.hap.Characteristic.CurrentVisibilityState, this.hap.Characteristic.CurrentVisibilityState.SHOWN);
        }
    }

    async getInput() {
        let identifier = 1;
        const processExists = require('process-exists');
        await processExists("kodi.exe").then(exists => {
            if (exists) identifier = 2;
        });
        await processExists("PotPlayerMini64.exe").then(exists => {
            if (exists) identifier = 3;
        });
        return identifier;
    }

    async setInput(value) {
        var execFile = require('child_process').execFile;
        switch (value) {
            case 1:
                break;
            case 2:
                execFile('C:\\Program Files\\Kodi\\kodi.exe');
                break;
            case 3:
                execFile('C:\\Program Files\\DAUM\\PotPlayer\\PotPlayerMini64.exe');
                break;
        }
    }
}