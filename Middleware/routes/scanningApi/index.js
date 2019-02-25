var express = require("express");
var router = express.Router();

router.get("/", function (req, res) {
    console.log('Scanning api route is working ');
    let response = {};
    response.message = "SCANNING API ROUTE IS WORKING";
    res.send(response);
});

module.exports = router;