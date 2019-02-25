var schedule = require("node-schedule");
var config = require("config");
var rn = require('random-number');
const http = require("http");
var promise = require("bluebird");


  var job = function AccessPointClientsJob() {
	schedule.scheduleJob(config.get("environment.constants.apclientsJobTimer"), function () {
		var datetime = new Date();
        console.log("Sample Job Running at : ", datetime);

        var apList = [];
        apList.push(config.get("simulator.scanning.apMac1"));
        apList.push(config.get("simulator.scanning.apMac2"));
        apList.push(config.get("simulator.scanning.apMac3"));
        apList.push(config.get("simulator.scanning.apMac4"));

        console.log('Printing aplist ',apList);
        var gen = rn.generator({
            min:  2,
            max:  10,
            integer: true
          })
        var apDeviceCountMap = new Map();
        for(var apMacAddr in apList){
            apDeviceCountMap.set(apMacAddr,  gen())
        }
        console.log('Printing apdevicecountmap ... ',apDeviceCountMap); 
        //POST call to scanning api method to perform logic and db insertion.
        _performUrlPost().then(function (result) {
            console.log('simulated apclient data is stored in database.')
		});
    });
};

function _performUrlPost() {
    var url = config.get("simulator.scanning.apiForSimulatedScanningApiData");
    return new Promise(function (fulfill, reject) {
        http.get(url, (resp) => {
            let data = "";
            console.log("response status ", resp.statusCode);
            console.log("response message ", resp.statusMessage);
            resp.on("data", (chunk) => {
                data += chunk;
            });
            // The whole response has been received. Print out the result.

            resp.on("end", () => {
                fulfill(JSON.parse(data));
            });

        }).on("error", (err) => {
            console.log("Error: " + err.message);
            reject(err);
        });
    });
}

module.exports.clientsJob = job;