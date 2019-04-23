const DEFAULTS = {
    REWIND         : 'KEY_REWIND',
    FAST_FORWARD   : 'KEY_FF',
    NEXT_TRACK     : '',
    PREVIOUS_TRACK : '',
    ARROW_UP       : 'up',
    ARROW_DOWN     : 'down',
    ARROW_LEFT     : 'left',
    ARROW_RIGHT    : 'right',
    SELECT         : 'enter',
    BACK           : 'escape',
    EXIT           : 'KEY_HOME',
    PLAY_PAUSE     : 'space',
    INFORMATION    : 'c'
};

module.exports = function(device) {
    let hap    = device.hap;
    let keys   = DEFAULTS;
    let output = {};

    for (let index in device.config.keys) {
        let key   = index.toString().toUpperCase();
        let value = device.config.keys[index];

        if (hap.Characteristic.RemoteKey[key] !== undefined) {
            keys[key] = value;
        }
    }

    for (let key in keys) {
        output[hap.Characteristic.RemoteKey[key]] = keys[key];
    }

    return output;
}