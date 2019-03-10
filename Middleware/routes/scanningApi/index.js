var express = require("express");
var router = express.Router();
var rn = require('random-number');
var promise = require("bluebird");
var config = require("config");
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
    console.log('Scanning api route is working ');
    let response = {};
    var gen = rn.generator({
        min: 200,
        max: 10000,
        integer: true
    })
    response.message = "SCANNING API ROUTE IS WORKING";
    response.count = gen();
    res.send(response);
});


/*Retrieving Unique Clients Count from database for perticular date */

router.get("/visitorCountByDate", function (req, res) {
    var datetime = new Date();
    let date = req.query.date || dateFormat(datetime, "yyyy-mm-dd");
    console.log("value of date ", date);

    db.any("select sum(entrances) as \"count\"  from meraki.realtime_mqtt_detections where dateformat_date ='" + date + "'")
        .then(function (result) {
            console.log("db select success for date ", result);
            res.status(200).send(result);

        })
        .catch(function (err) {
            console.log("not able to get connection " + err);
            res.status(500).send(JSON.stringify(err.message));
        });
});

router.get("/visitorPattern", function (req, res) {
    let pattern = req.query.pattern || 'today';
    if (pattern == 'today') {
        var datetime = new Date();
        let date = dateFormat(datetime, "yyyy-mm-dd");
        db.any("select count (distinct (client_mac_address)), dateformat_hour  as timeRange from meraki.scanning_ap_data where dateformat_date ='" + date + "' group by dateformat_hour")
            .then(function (result) {
                console.log("db select success for date ", result);
                res.status(200).send(result);

            })
            .catch(function (err) {
                console.log("not able to get connection " + err);
                res.status(500).send(JSON.stringify(err.message));
            });
    } else if (pattern == 'yesterday') {
        var datetime = new Date();
        datetime.setDate(datetime.getDate() - 1);
        let date = dateFormat(datetime, "yyyy-mm-dd");

        db.any("select count (distinct (client_mac_address)), dateformat_hour as timeRange from meraki.scanning_ap_data where dateformat_date ='" + date + "' group by dateformat_hour")
            .then(function (result) {
                console.log("db select success for date ", result);
                res.status(200).send(result);

            })
            .catch(function (err) {
                console.log("not able to get connection " + err);
                res.status(500).send(JSON.stringify(err.message));
            });
    } else if (pattern == 'this week') {
        let weekValue = dateFormat(datetime, "W");
        db.any("select count (distinct (client_mac_address)), dateformat_date as timeRange from meraki.scanning_ap_data where dateformat_week =" + weekValue + " group by dateformat_date")
            .then(function (result) {
                console.log("db select success for date ", result);
                res.status(200).send(result);

            })
            .catch(function (err) {
                console.log("not able to get connection " + err);
                res.status(500).send(JSON.stringify(err.message));
            });
    } else if (pattern == 'last week') {
        let weekValue = dateFormat(datetime, "W");
        weekValue = weekValue - 1;
        db.any("select count (distinct (client_mac_address)), dateformat_date as timeRange from meraki.scanning_ap_data where dateformat_week =" + weekValue + " group by dateformat_date")
            .then(function (result) {
                console.log("db select success for date ", result);
                res.status(200).send(result);

            })
            .catch(function (err) {
                console.log("not able to get connection " + err);
                res.status(500).send(JSON.stringify(err.message));
            });
    } else if (pattern == 'this month') {
        let monthValue = dateFormat(datetime, "m");
        console.log(monthValue);
        db.any("select count (distinct (client_mac_address)),CONCAT('week ',dateformat_week) as timeRange  from meraki.scanning_ap_data where dateformat_month =" + monthValue + " group by dateformat_week")
            .then(function (result) {
                console.log("db select success for date ", result);
                res.status(200).send(result);

            })
            .catch(function (err) {
                console.log("not able to get connection " + err);
                res.status(500).send(JSON.stringify(err.message));
            });
    } else if (pattern == 'last month') {
        let monthValue = dateFormat(datetime, "m");
        monthValue = monthValue - 1;
        console.log(monthValue);
        db.any("select count (distinct (client_mac_address)),CONCAT('week ',dateformat_week) as timeRange  from meraki.scanning_ap_data where dateformat_month =" + monthValue + " group by dateformat_week")
            .then(function (result) {
                console.log("db select success for date ", result);
                res.status(200).send(result);

            })
            .catch(function (err) {
                console.log("not able to get connection " + err);
                res.status(500).send(JSON.stringify(err.message));
            });
    }

});

router.get("/currentVisitorCount", function (req, res) {

    var datetime = new Date();
    let formattedDateString = dateFormat(datetime, "yyyy-mm-dd");
    let hourValue = dateFormat(datetime, "H");

    var selectQuery = "SELECT sum(temp.zone_count) as visitor_count from (SELECT (case when max(cam.entrances) > 0 then max(cam.entrances) else 0 end) as zone_count, zones.zone_id , zones.zone_name from meraki.realtime_zones zones left join meraki.realtime_mqtt_detections cam "
        + " on cam.zone_id = zones.zone_id and  "
        + " cam.dateformat_date = '" + formattedDateString + "' and cam.dateformat_hour="+hourValue 
        + " and cam.dateformat_minute =(select dateformat_minute from meraki.realtime_mqtt_detections "
        + " order by unique_mqtt_detection_key desc LIMIT 1 ) "
        + " group by zones.zone_id, zones.zone_name) as temp";

    console.log(selectQuery);

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