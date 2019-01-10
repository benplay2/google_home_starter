# TO add to README
- Creating publicly available webserver (https://www.raspberrypi.org/documentation/remote-access/access-over-Internet/)
- Capabilities (control anything and as many actions/switches as desired, could have 1 rasp control many devices... as well as raspi's)
- How to add new switches & actions
- Update author
- How to point IFTTT to your raspi
- Bring node.js setup instructions into this readme
- How to test locally


## Updates in this fork
This repository has been forked from krpeacock to add additional functionality for items that have an unknown state. Example: ring the door bell.

## Google Home Starter Guide
Thanks for looking through this guide! If you have any questions getting this up and running, please feel free to submit an Issue or email me at kylpeacock@gmail.com. 

### Getting Started
If you haven't already, install git and node.js on your device.

node.js installation on Raspberry Pi: https://www.instructables.com/id/Install-Nodejs-and-Npm-on-Raspberry-Pi/

1. Fork or clone this repository onto your device. 
2. In your console, run `npm install` to install the required components.
3. Run `touch .env` to create your hidden, gitignored environment config file.
4. In .env, configure your environment as follows:
    * `DEV=`  `TRUE` if you are on desktop, or `FALSE` if you are on your raspberry pi
    * `PORT=` `8000` for development, `80` or `443` for HTTP or HTTPS
    * `PASS=` Whatever you want your password to be
5. Run `npm start` to launch the server (Note: may need to use sudo)

When you make a POST request to the server, follow this structure: 
`http://ipaddresshere/API/switches/sw1?password=yourpasswordhere`

### Next Steps
You will want to configure the Python files to suit your project's needs. 

To add or edit a switch, go into saveState.json. Use the first switch as a guide, and add a new object to the switches array. 

You can serve your own frontend out of the public folder, and it will be accessible on the root route if you make a get request to your IP address. 

---
_More instructions involving creation of a switch and integrating with Google Home:_
https://www.instructables.com/id/Google-Home-Raspberry-Pi-Power-Strip/
