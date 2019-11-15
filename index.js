var Service, Characteristic, limiter;
var exec = require("child_process").exec,
    RateLimiter = require('limiter').RateLimiter;

module.exports = function(homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    limiter = new RateLimiter(1, 200); //limit requests to one per 200ms
    homebridge.registerAccessory("homebridge-chacon",
        "RFChacon",
        RFOutletAccessory);
}

function RFOutletAccessory(log, config) {
    this.log = log;

    //Accessory information
    this.name = config["name"];
    this.type = config["type"];
    this.manufacturer = config["manufacturer"];
    this.model = config["model"];
    this.serial = config["serial"];

    //RF transmit inforamtion
    this.rf_on = "on";
    this.rf_off = "off";
    if(config["inverted"] || false){
        this.rf_on = "off";
        this.rf_off = "on";
    }

    if (config["pin"]) {
        this.pin = config["pin"];
    } else {
        this.pin = 0; //Default to GPIO pin 0
    }

    if(config["module_id"]){
        this.module_id = config["module_id"];
    } else{
        this.module_id = "12325261" // Default Id, can be changed in config
    }

    if(config["outlet_code"]){
        this.outlet_code = config["outlet_code"];
    } else{
	    this.outlet_code = "1"; //Default outlet code, can be change in config
    }


    this.cmdBase = "sudo " + //the codesend executable requires root
        __dirname + //module directory
        "/chacon_send " + this.pin + " " + this.module_id + " " + this.outlet_code + " ";
    var that = this;
    that.setPowerState(false, function(){ }); //Set default state to false
}

RFOutletAccessory.prototype = {
    setPowerState: function(powerOn, callback) {
        var state;
        var cmd;

        if (powerOn) {
            cmd = this.cmdBase + this.rf_on;
            state = "on";
        } else {
            cmd = this.cmdBase + this.rf_off;
            state = "off";
        }

        this.log("Turning " + this.name + " " + state);
        this.log(cmd);

    limiter.removeTokens(1, function() {
	    RFOutletAccessory.runningByAnotherItem = true;
            exec(cmd, function(error, stdout, stderr) {
                if (error) {
                        console.log(error);
                }
                callback();
            })
        });
    },

    identify: function(callback) {
        this.log("HomeKit identify requested");
        callback();
    },

    getServices: function() {
        var informationService = new Service.AccessoryInformation();

        informationService
            .setCharacteristic(Characteristic.Manufacturer, this.manufacturer)
            .setCharacteristic(Characteristic.Model, this.model)
            .setCharacteristic(Characteristic.SerialNumber, this.serial);

        var outletService;

        switch (this.type) {
            case "Switch":
                this.outletService = new Service.Switch(this.name);
                break;
            case "Light":
                this.outletService = new Service.Lightbulb(this.name);
                break;
            case "Fan":
                this.outletService = new Service.Fan(this.name);
                break;
	    case "Heater":
		this.outletService = new Service.HeaterCooler(this.name);
		break;
            default:
                this.outletService = new Service.Switch(this.name);
        }

        this.outletService
            .getCharacteristic(Characteristic.On)
            .on('set', this.setPowerState.bind(this));

        return [informationService, this.outletService];
    }
};
