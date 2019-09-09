var events = require('events');
var eventEmitter = new events.EventEmitter();

eventEmitter.on('login_success', () => {
    console.log("Login successfully")
});

eventEmitter.on('login_fail', () => {
    console.log("Login failed")
});

module.exports = eventEmitter;