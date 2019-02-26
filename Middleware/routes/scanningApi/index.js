var express = require("express");
var router = express.Router();
var rn = require('random-number');

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

module.exports = router;