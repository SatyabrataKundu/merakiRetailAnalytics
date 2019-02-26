var express = require("express");
var router = express.Router();
var rn = require('random-number');
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
    let date = req.query.date;
    console.log("value of date ", date);

    db.any("select count (distinct (client_mac_address)) from meraki.scanning_ap_data where dateformat_date ='" + date + "'")
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