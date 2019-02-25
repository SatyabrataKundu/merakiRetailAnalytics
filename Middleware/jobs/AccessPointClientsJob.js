var schedule = require("node-schedule");
var config = require("config");
var rn = require('random-number');
var Request = require("request");
const debug = require("debug");


var job = function AccessPointClientsJob() {
    schedule.scheduleJob(config.get("environment.constants.apclientsJobTimer"), function () {
        var datetime = new Date();
        console.log("Sample Job Running at : ", datetime);

        //POST call to scanning api method to perform logic and db insertion.
        _performUrlPost().then(function (result) {
            console.log('simulated apclient data is stored in database.');
            console.log('Printing promise result ', result);
        });
    });
};

function _performUrlPost() {

    var apList = [];
    apList.push(config.get("simulator.scanning.apMac1"));
    apList.push(config.get("simulator.scanning.apMac2"));
    apList.push(config.get("simulator.scanning.apMac3"));
    apList.push(config.get("simulator.scanning.apMac4"));

    console.log('Printing aplist ', apList);
    var gen = rn.generator({
        min: 2,
        max: 10,
        integer: true
    })

    var reqPostParams = {};
    let arrayOfData = [];

    apList.forEach(apMacAddr => {

        let apClientsObject = {};
        apClientsObject.apMacAddr = apMacAddr;
        apClientsObject.numberOfClients = gen();
        arrayOfData.push(apClientsObject);

    });
    reqPostParams.data = arrayOfData;

    var url = config.get("simulator.scanning.apiForSimulatedScanningApiData");
    return new Promise(function (fulfill, reject) {

        Request.post({
            "headers": {
                "Content-Type": "application/json",
                "Content-Length": JSON.stringify(reqPostParams).length
            },
            "url": config.get("simulator.scanning.apiForSimulatedScanningApiData"),
            "body": JSON.stringify(reqPostParams)
        }, (error, response, body) => {
            if (error) {
                debug("Error: " + error.message);
                reject(error);

            }
            else {
                let returnData = {};
                returnData = JSON.parse(body);
                debug("Response success : " + returnData);
                fulfill(returnData);
            }
        });
    });
}

module.exports.clientsJob = job;




