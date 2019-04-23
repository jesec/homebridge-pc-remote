module.exports = class Information {
    constructor(accessory) {
        this.accessory = accessory;
        this.hap       = accessory.hap;
        this.device    = accessory.device;

        this.createService();
    }

    getServices() {
        return [this.service];
    }

    createService() {
        this.service = new this.hap.Service.AccessoryInformation()
            .setCharacteristic(this.hap.Characteristic.Name, "PC")
            .setCharacteristic(this.hap.Characteristic.Manufacturer, 'PC')
            .setCharacteristic(this.hap.Characteristic.Model, 'PC')
            .setCharacteristic(this.hap.Characteristic.SerialNumber, this.device.config.number);
    }
}