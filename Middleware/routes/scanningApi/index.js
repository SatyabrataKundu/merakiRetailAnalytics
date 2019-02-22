var express = require("express");
var router = express.Router();

router.get("/", function (req, res) {
    console.log('Scanning api route is working ');
    res.send("SCANNING API ROUTE IS WORKING");
});

module.exports = router;