# homebridge-rf-chacon-dio

Homebridge plugin purpose-built for controlling 433MHz radio frequency outlets, using chacon / dio protocol, which can be purchased inexpensively. (i.e. [these](https://www.amazon.com/Etekcity-Wireless-Electrical-Household-Appliances/dp/B00DQELHBS "Etekcity Wireless Outlets")). Homebridge maintains state information, so you can always know if you left that lamp on.

Tested on a Raspberry Pi Zero running Raspbian (Debian) and Node.js v6.9.0. This should work on most Raspberry Pi models, however YMMV

Supports *lights*, *switches*, and *fans*

## Installation

- Install homebridge  
`sudo npm install -g homebridge`

- Install homebridge-rfoutlets  
`sudo npm install -g homebridge-rf-chacon-dio`

- Update your homebridge configuration

## Notes

- The user which homebridge is run from must be on the list of *sudoers* as the `chacon_send` executable requires root privileges
- A great guide on how to record RF signals and set up your Pi to transmit can be found [here](https://www.samkear.com/hardware/control-power-outlets-wirelessly-raspberry-pi "Pi 433Mhz Transmitter Guide"). Note: the web portion of the guide is not required

## Configuration

- `name`: Name of your device
- `type`: `Light`, `Switch`, or `Fan` (**required**)
- `manufacturer`: manufacturer of the device plugged into the outlet (*optional*, defaults to *blank*)
- `model`: model of the device plugged into the outlet (*optional*, defaults to *blank*)
- `serial`: serial number of the device plugged into the outlet (*optional*, defaults to *blank*)
- `pin`: GPIO pin of the 433MHz transmitter (*optional*, defaults to 0)
- `module_id` : Remote control Id you want to emulate with 433Mhz sender. Could be randomize if your outlet has learning mode
- `outlet_code` : Position button on your remote control. Could be randomize if your outlet has learning mode
See `sample-config.json`
