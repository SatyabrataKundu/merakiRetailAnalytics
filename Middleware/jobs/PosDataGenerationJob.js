// var schedule = require("node-schedule");
// var config = require("config");
// var rn = require('random-number');
// var Request = require("request");
// const debug = require("debug");
// var promise = require("bluebird");
// var dateFormat = require("dateformat");
// let date = require('date-and-time');
// var dbOptions = {
//     // Initialization Options
//     promiseLib: promise
// };
// var pgp = require("pg-promise")(dbOptions);

// var connectionString = "postgres://" + config.get("environment.merakiConfig.dbUserName") + ":" +
//     "postgres" + "@localhost:" + config.get("environment.merakiConfig.dbPort") +
//     "/" + config.get("environment.merakiConfig.dbName");
// var db = pgp(connectionString);


// var job = function PosDataJob() {

//     schedule.scheduleJob(config.get("environment.constants.PosJobTimer"), function () {
//         var datetime = new Date();
//         console.log("Sample Job Running at : ", datetime);

//         //POST call to scanning api method to perform logic and db insertion.
//         _performPosUrlPost().then(function (result) {
//             console.log('simulated apclient data is stored in database.');
//             console.log('Result of performPosUrlPost ',result);
//             result.forEach(function (value) {

//                 var datetime = new Date();
               
//                 let formattedDateString = dateFormat(datetime, "yyyy-mm-dd");
//                 let yearValue = dateFormat(datetime, "yyyy");
//                 let monthValue = dateFormat(datetime, "m");
//                 let weekValue = dateFormat(datetime, "W");
//                 let dayValue = dateFormat(datetime, "d");
//                 let hourValue = dateFormat(datetime, "H");
//                 let minuteValue = dateFormat(datetime, "M");

//                 var insertQueryForDB = "INSERT INTO meraki.pos_data "
//                     + "(uuid,"
//                     + "no_of_items,"
//                     + "total_amount,"
//                     + "pos_counter_number,"
//                     + "datetime, "
//                     + "dateformat_date,"
//                     + "dateformat_year, "
//                     + "dateformat_month,"
//                     + "dateformat_week, "
//                     + "dateformat_day, "
//                     + "dateformat_hour, "
//                     + "dateformat_minute,"
//                     + " VALUES ('"
//                     + JSON.stringify(value.uUid) + "','"
//                     + JSON.stringify(value.noOfItems) + "',"
//                     + JSON.stringify(value.totalAmount) + "',"
//                     + JSON.stringify(value.posCounterNumber) + "',"
//                     + datetime.getTime() + ",'"
//                     + formattedDateString + "',"
//                     + yearValue + ","
//                     + monthValue + ","
//                     + weekValue + ","
//                     + dayValue + ","
//                     + hourValue + ","
//                     + minuteValue + ","
//                     + ")";

//                 return new Promise(function (fulfill, reject) {
//                     db.none(insertQueryForDB)
//                         .then(function (response) {

//                             console.log("db insert success for uuid ", value.uUid);
//                             fulfill(response);
//                         })
//                         .catch(function (err) {
//                             console.log("not able to get connection " + err);
//                             reject(err);
//                         });
//                 });
//             });
//         });
//     });
// };

// function getPosData(req, res, next) {
//     db.any('select * from pos_data')
//       .then(function (data) {
//         res.status(200)
//           .json({
//             status: 'success',
//             data: data,
//             message: 'Retrieved ALL puppies'
//           });
//       })
//       .catch(function (err) {
//         return next(err);
//       });
//   }


//     //var url = config.get("simulator.posData.apiForPosData");
//     // return new Promise(function (fulfill, reject) {

//     //     Request.post({
//     //         "headers": {
//     //             "Content-Type": "application/json",
//     //             "Content-Length": JSON.stringify(reqPostParams).length
//     //         },
//     //         "url": config.get("simulator.posData.apiForPosData"),
//     //         "body": JSON.stringify(reqPostParams)
//     //     }, (error, response, body) => {
//     //         if (error) {
//     //             debug("Error: " + error.message);
//     //             reject(error);

//     //         }
//     //         else {
//     //             let returnData = {};
//     //             returnData = JSON.parse(body);
//     //             debug("Response success : " + returnData);
//     //             fulfill(returnData);
//     //         }
//     //     });
//     // });


// module.exports.PosJob = job;




