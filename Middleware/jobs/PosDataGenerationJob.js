// JavaScript source code
var shedule = require('node-schedule');
/* run the job at every 5 mins*/
var event = shedule.scheduleJob('*/5 * * * *', function () {
    var randomNumberOfItems = getRandomInt(10);
    var randomTotalAmount = getRandomInt(10000);

    console.log('This runs every 5 minutes' + randomNumberOfItems +' ' +randomTotalAmount);
});

function getRandomNumberOfItems(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function getRandomTotalAmount(max) {
    return Math.floor(Math.random() * Math.floor(max));
}