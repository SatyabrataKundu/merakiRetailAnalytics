var express = require("express");
var router = express.Router();
var dateFormat = require("dateformat");
var promise = require("bluebird");
var config = require("config");
var dbOptions = {
    // Initialization Options
    promiseLib: promise
};
var pgp = require("pg-promise")(dbOptions);

var connectionString = "postgres://" + config.get("environment.merakiConfig.dbUserName") + ":" +
    config.get("environment.merakiConfig.dbPassword") + "@localhost:" + config.get("environment.merakiConfig.dbPort") +
    "/" + config.get("environment.merakiConfig.dbName");
var db = pgp(connectionString);

router.get("/waitTime", function (req, res) {
    // res.status(200).send("success");
    var endDate = new Date();
    var startdate = new Date();
    var durationInMinutes = config.get("simulator.checkout.queueconstant");
    startdate.setMinutes(endDate.getMinutes() - durationInMinutes);
    console.log("Start Date " + startdate);
    console.log("End Date " + endDate);

    let query = "select (case when ROUND((count(distinct (cam.person_oid)) - count(distinct(unique_pos_data_key)))/2.0,2)>0 Then  ROUND((count(distinct (cam.person_oid)) - count(distinct(unique_pos_data_key)))/2.0,2) ELSE 0 END) as waitTime, pos.pos_counter_number as posId from meraki.camera_detections cam right outer join meraki.checkoutzone_billingcounter_map mapp on cam.zoneid=mapp.zone_id right outer join meraki.pos_data pos on mapp.pos_counter_number=pos.pos_counter_number where "
        + "(cam.datetime between " + startdate.getTime() + " and " + endDate.getTime() + ") "
        + "and (pos.datetime between  " + startdate.getTime() + " and " + endDate.getTime() + ") "
        + "group by cam.zoneid,pos.pos_counter_number";
    console.log(query);
    db.any(query)
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