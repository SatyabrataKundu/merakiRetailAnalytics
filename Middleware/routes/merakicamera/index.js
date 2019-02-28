var express = require("express");
var router = express.Router();
var config = require("config");
var rn = require('random-number');
var promise = require("bluebird");
var dateFormat = require("dateformat");
var dbOptions = {
    // Initialization Options
    promiseLib: promise
};
var pgp = require("pg-promise")(dbOptions);

var connectionString = "postgres://" + config.get("environment.merakiConfig.dbUserName") + ":" +
    config.get("environment.merakiConfig.dbPassword") + "@localhost:" + config.get("environment.merakiConfig.dbPort") +
    "/" + config.get("environment.merakiConfig.dbName");
var db = pgp(connectionString);

router.get("/", function (req, res) {

    var responseObject = {};
    var dataList = [];
    var zoneList = [];
    zoneList.push(config.get("simulator.merakicam.entryZoneId"));
    zoneList.push(config.get("simulator.merakicam.checkoutZoneId"));
    zoneList.push(config.get("simulator.merakicam.kidsZoneId"));
    zoneList.push(config.get("simulator.merakicam.groceryZoneId"));
    zoneList.push(config.get("simulator.merakicam.apparelZoneId"));
    zoneList.push(config.get("simulator.merakicam.furnitureZoneId"));
    zoneList.push(config.get("simulator.merakicam.electronicsZoneId"));
    zoneList.push(config.get("simulator.merakicam.exitZoneId"));


    zoneList.forEach(function (zoneId) {
        //Generate number of clients. 
        var gen1 = rn.generator({
            min: 0,
            max: 2,
            integer: true
        })

        var gen2 = rn.generator({
            min: 0,
            max: 10,
            integer: true
        })

        var datetime = new Date();
        let ts = datetime.getTime();
        let formattedDateString = dateFormat(datetime, "yyyy-mm-dd");
        let yearValue = dateFormat(datetime, "yyyy");
        let monthValue = dateFormat(datetime, "m");
        let weekValue = dateFormat(datetime, "W");
        let dayValue = dateFormat(datetime, "d");
        let hourValue = dateFormat(datetime, "H");
        let minuteValue = dateFormat(datetime, "M");

        let dbInsertCamData = {};
        dbInsertCamData.ts = ts;
        dbInsertCamData.dateFormat_date = formattedDateString;
        dbInsertCamData.dateFormat_year = yearValue;
        dbInsertCamData.dateFormat_month = monthValue;
        dbInsertCamData.dateFormat_week = weekValue;
        dbInsertCamData.dateFormat_day = dayValue;
        dbInsertCamData.dateFormat_hour = hourValue;
        dbInsertCamData.dateFormat_minute = minuteValue;

        var numberOfPeopleDetected = 0;
        if (zoneId === config.get("simulator.merakicam.entryZoneId") || zoneId === config.get("simulator.merakicam.exitZoneId")) {
            numberOfPeopleDetected = gen2();
        }
        else {
            numberOfPeopleDetected = gen1();
        }
        for (i = 0; i < numberOfPeopleDetected; i++) {
            var genOID = rn.generator({
                min: 1000,
                max: 9999,
                integer: true
            })
            dbInsertCamData.personOID = genOID();
            dbInsertCamData.zoneId = zoneId;

             _performDBInsert(dbInsertCamData);
            dataList.push(dbInsertCamData);
        }
    });

    responseObject.data = dataList;
    res.status(200).send(responseObject);
});


function _performDBInsert(dbInsertCamData) {
    return new Promise(function (fulfill, reject) {
        var insertQueryForDB = "INSERT INTO meraki.camera_detections "
            + "(person_oid,"
            + "zoneId,"
            + "datetime, "
            + "dateformat_date,"
            + "dateformat_year, "
            + "dateformat_month,"
            + "dateformat_week, "
            + "dateformat_day, "
            + "dateformat_hour, "
            + "dateformat_minute)"
            + " VALUES ("
            + dbInsertCamData.personOID + ","
            + dbInsertCamData.zoneId + ","
            + dbInsertCamData.ts + ",'"
            + dbInsertCamData.dateFormat_date + "',"
            + dbInsertCamData.dateFormat_year + ","
            + dbInsertCamData.dateFormat_month + ","
            + dbInsertCamData.dateFormat_week + ","
            + dbInsertCamData.dateFormat_day + ","
            + dbInsertCamData.dateFormat_hour + ","
            + dbInsertCamData.dateFormat_minute
            + ")";

        db.none(insertQueryForDB)
            .then(function (response) {
                console.log("db insert success for oid and zone  ", dbInsertCamData.personOID + " zone " + dbInsertCamData.zoneId);
                fulfill(response);
            })
            .catch(function (err) {
                console.log("not able to get connection " + err);
                reject(err);
            });
    });
}

module.exports = router;
