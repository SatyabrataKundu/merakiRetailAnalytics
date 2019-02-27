var express = require("express");
var router = express.Router();
var schedule = require("node-schedule");
var config = require("config");
var rn = require('random-number');
var Request = require("request");
const debug = require("debug");
var promise = require("bluebird");
var dateFormat = require("dateformat");
let date = require('date-and-time');
var dbOptions = {
    // Initialization Options
    promiseLib: promise
};
var pgp = require("pg-promise")(dbOptions);

var connectionString = "postgres://" + config.get("environment.merakiConfig.dbUserName") + ":" +
    config.get("environment.merakiConfig.dbPassword") + "@localhost:" + config.get("environment.merakiConfig.dbPort") +
    "/" + config.get("environment.merakiConfig.dbName");
var db = pgp(connectionString);


/*Simulate the POS informations*/
router.get("/generatePOSdata", function (req, res) {
    var response = {};
    _performPosUrlPost()
    response.message="success"
    res.status(200).send(response);
});

function _performPosUrlPost() {

    var genNoOfItems = rn.generator({
        min: 2,
        max: 10,
        integer: true
    })
    var genTotalAmount = rn.generator({
        min: 2,
        max: 10000,
        integer: true
    })
    var genBillingCounterNumber = rn.generator({
        min: 1,
        max: 5,
        integer: true
    })
    var reqPostParams = {};
    let arrayOfData = [];
    for (var i = 0; i < genNoOfItems(); i++) {
        let posObject = {};

        posObject.randomNumberOfItems = genNoOfItems();
        posObject.randomTotalAmount = genTotalAmount();
        posObject.posCounterNumber = genBillingCounterNumber();
        arrayOfData.push(posObject);

        var datetime = new Date();

        let formattedDateString = dateFormat(datetime, "yyyy-mm-dd");
        let yearValue = dateFormat(datetime, "yyyy");
        let monthValue = dateFormat(datetime, "m");
        let weekValue = dateFormat(datetime, "W");
        let dayValue = dateFormat(datetime, "d");
        let hourValue = dateFormat(datetime, "H");
        let minuteValue = dateFormat(datetime, "M");
        var insertQueryForDB = "INSERT INTO meraki.pos_data "
            + "(no_of_items,"
            + "total_amount,"
            + "pos_counter_number,"
            + "datetime, "
            + "dateformat_date,"
            + "dateformat_year, "
            + "dateformat_month,"
            + "dateformat_week, "
            + "dateformat_day, "
            + "dateformat_hour, "
            + "dateformat_minute)"
            + " VALUES ("
            + JSON.stringify(posObject.randomNumberOfItems) + ","
            + JSON.stringify(posObject.randomTotalAmount) + ","
            + JSON.stringify(posObject.posCounterNumber) + ",'"
            + datetime.getTime() + "','"
            + formattedDateString + "',"
            + yearValue + ","
            + monthValue + ","
            + weekValue + ","
            + dayValue + ","
            + hourValue + ","
            + minuteValue
            + ")";

        db.none(insertQueryForDB)
            .then(function (response) {
                console.log("db insert success for uuid ",posObject);              
            })
            .catch(function (err) {
                console.log("not able to get connection " + err);
            });

    }
    console.log(arrayOfData);
}

module.exports = router;
