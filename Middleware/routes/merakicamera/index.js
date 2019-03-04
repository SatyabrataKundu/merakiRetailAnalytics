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


router.post("/clients", function(req, res){


    var zoneId = req.body.zoneId;
    var timeRange = req.body.timeRange || "today";
   

    console.log('Value of zone id is ',zoneId);
    console.log('value of time range is ',timeRange);
    
    if(timeRange === "today"){
        let datetime = new Date();
        let formattedDateString = dateFormat(datetime, "yyyy-mm-dd");

        let selectDataQuery = "select count(person_oid) as detected_clients , dateformat_hour"
        +" from meraki.camera_detections "
        +" where zoneid="+zoneId
        +" and dateformat_date='"+formattedDateString
        +"' group by dateformat_hour order by dateformat_hour";

        db.any(selectDataQuery)
        .then(function (result) {
            console.log("db select success", result);
            res.status(200).send(result);

        })
        .catch(function (err) {
            console.log("not able to get connection " + err);
            res.status(500).send(JSON.stringify(err.message));
        });

    }
    else if (timeRange === "yesterday"){
        let datetime = new Date();
        datetime.setDate(datetime.getDate() - 1);
        let formattedDateString = dateFormat(datetime, "yyyy-mm-dd");

        let selectDataQuery = "select count(person_oid) as detected_clients , dateformat_hour"
        +" from meraki.camera_detections "
        +" where zoneid="+zoneId
        +" and dateformat_date='"+formattedDateString
        +"' group by dateformat_hour order by dateformat_hour";
        db.any(selectDataQuery)
        .then(function (result) {
            console.log("db select success", result);
            res.status(200).send(result);

        })
        .catch(function (err) {
            console.log("not able to get connection " + err);
            res.status(500).send(JSON.stringify(err.message));
        });

    }
    else if (timeRange === "this week"){
        let datetime = new Date();
        let weekValue = dateFormat(datetime, "W");

        let selectDataQuery = "select count(person_oid) as detected_clients , dateformat_date"
        +" from meraki.camera_detections "
        +" where zoneid="+zoneId
        +" and dateformat_week="+weekValue
        +" group by dateformat_date order by dateformat_date";
        db.any(selectDataQuery)
        .then(function (result) {
            console.log("db select success", result);
            res.status(200).send(result);

        })
        .catch(function (err) {
            console.log("not able to get connection " + err);
            res.status(500).send(JSON.stringify(err.message));
        });

    }
    else if (timeRange === "last week"){
        let datetime = new Date();
        let weekValue = dateFormat(datetime, "W") -1;

        let selectDataQuery = "select count(person_oid) as detected_clients , dateformat_date"
        +" from meraki.camera_detections "
        +" where zoneid="+zoneId
        +" and dateformat_week="+weekValue
        +" group by dateformat_date order by dateformat_date";
        db.any(selectDataQuery)
        .then(function (result) {
            console.log("db select success", result);
            res.status(200).send(result);

        })
        .catch(function (err) {
            console.log("not able to get connection " + err);
            res.status(500).send(JSON.stringify(err.message));
        });

    }
    else if (timeRange === "this month"){
        let datetime = new Date();
        let monthValue = dateFormat(datetime, "m");
        let selectDataQuery = "select count(person_oid) as detected_clients , dateformat_week"
        +" from meraki.camera_detections "
        +" where zoneid="+zoneId
        +" and dateformat_month="+monthValue
        +" group by dateformat_week order by dateformat_week";
        db.any(selectDataQuery)
        .then(function (result) {
            console.log("db select success", result);
            res.status(200).send(result);

        })
        .catch(function (err) {
            console.log("not able to get connection " + err);
            res.status(500).send(JSON.stringify(err.message));
        });

    }
    else if (timeRange === "last month"){
        let datetime = new Date();
        let monthValue = dateFormat(datetime, "m") -1;
        let selectDataQuery = "select count(person_oid) as detected_clients , dateformat_week"
        +" from meraki.camera_detections "
        +" where zoneid="+zoneId
        +" and dateformat_month="+monthValue
        +" group by dateformat_week order by dateformat_week";
        db.any(selectDataQuery)
        .then(function (result) {
            console.log("db select success", result);
            res.status(200).send(result);

        })
        .catch(function (err) {
            console.log("not able to get connection " + err);
            res.status(500).send(JSON.stringify(err.message));
        });

    }
})




router.get("/zones", function (req, res) {

    var responseObject = {};
  
    var zoneList = [];

    let zoneObject1 = {};
    zoneObject1.zoneId =config.get("simulator.merakicam.entryZoneId");
    zoneObject1.zoneName = "Entry"
    zoneList.push(zoneObject1);
    let zoneObject2 = {};
    zoneObject2.zoneId =config.get("simulator.merakicam.checkoutZoneId");
    zoneObject2.zoneName = "Checkout"
    zoneList.push(zoneObject2);
    let zoneObject3 = {};
    zoneObject3.zoneId =config.get("simulator.merakicam.kidsZoneId");
    zoneObject3.zoneName = "Kids"
    zoneList.push(zoneObject3);
    let zoneObject4 = {};
    zoneObject4.zoneId =config.get("simulator.merakicam.groceryZoneId");
    zoneObject4.zoneName = "Grocery"
    zoneList.push(zoneObject4);
    let zoneObject5 = {};
    zoneObject5.zoneId =config.get("simulator.merakicam.apparelZoneId");
    zoneObject5.zoneName = "Apparel"
    zoneList.push(zoneObject5);
    let zoneObject6 = {};
    zoneObject6.zoneId =config.get("simulator.merakicam.furnitureZoneId");
    zoneObject6.zoneName = "Furniture"
    zoneList.push(zoneObject6);
    let zoneObject7 = {};
    zoneObject7.zoneId =config.get("simulator.merakicam.electronicsZoneId");
    zoneObject7.zoneName = "Electronics"
    zoneList.push(zoneObject7);
    let zoneObject8 = {};
    zoneObject8.zoneId =config.get("simulator.merakicam.exitZoneId");
    zoneObject8.zoneName = "Exit"
    zoneList.push(zoneObject8);

    responseObject.zoneList = zoneList;

    res.status(200).send(responseObject);
});

router.get("/currentVisitorsPerZone", function (req, res) {

    var datetime = new Date();
    let formattedDateString = dateFormat(datetime, "yyyy-mm-dd");
    let hourValue = dateFormat(datetime, "H");

    var selectQuery = "SELECT COUNT(DISTINCT(person_oid)), zoneid "
    +" from meraki.camera_detections where "
    +" dateformat_date = '"+formattedDateString+"' and dateformat_hour="+hourValue 
    +" and dateformat_minute= (select dateformat_minute from meraki.camera_detections "
    +" order by unique_camera_detection_key desc LIMIT 1 ) 	group by zoneid";
    db.any(selectQuery)
        .then(function (result) {
            console.log("db select success for date ", result);
            res.status(200).send(result);

        })
        .catch(function (err) {
            console.log("not able to get connection " + err);
            res.status(500).send(JSON.stringify(err.message));
        });
});


module.exports = router;
