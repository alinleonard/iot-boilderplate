var express = require('express');
var logger = require('morgan');

var mqtt = require('mqtt');

var broker = 'mqtt://localhost:1883';
var client  = mqtt.connect(broker);


var app = express();

app.use(logger('dev'));

console.log('Looking to connect to broker: ' + broker);

client.on('connect', function () {
  console.log('Connected to the broker')
  client.subscribe('presence')
  client.publish('presence', 'Hello mqtt')
  
  client.subscribe('/devices/<device_id>/events/sensor')
  var obj = JSON.parse('{ "test": 123, "jooq": "231", "time": "' + Date.now() + '"}')
  var buf = Buffer.from(JSON.stringify(obj));
  client.publish('/devices/<device_id>/events/sensor', buf)
})

client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString())
  client.end()
})