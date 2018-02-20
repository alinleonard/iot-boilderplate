load('api_arduino_bme280.js');
load('api_gpio.js');
load('api_sys.js');
load('api_mqtt.js');
load('api_timer.js');
load('api_config.js');

// MQTT
let topic = '/devices/' + Cfg.get('device.id') + '/events';
// Sensors address
let sens_addr = Cfg.get('i2c.address') | 0x77;
// Initialize Adafruit_BME280 library
let bme = Adafruit_BME280.create();
// Initialize the sensor
if (bme.begin(sens_addr) === 0) {
  print('Cant find a sensor');
} else {
  print('BME280 sensor found!');
  print('Temperature:', bme.readTemperature(), '*C');
  print('Humidity:', bme.readHumidity(), '%RH');
  print('Pressure:', bme.readPressure(), 'hPa');
}


MQTT.sub('devices/#', function(conn, topic, msg) {
	print('Topic:', topic, 'message:', msg);
	
}, null);

let getBmeInfo = function() {
  let ram = Sys.free_ram() / 1024;
  let temperature = bme.readTemperature();
  let humidity = bme.readHumidity();
  let pressure = bme.readPressure();
  
  let message = JSON.stringify({ temperature: temperature, humidity: humidity, pressure: pressure});
  
  MQTT.pub('devices', message, 1));
  print('Published:', ok, topic, '->', message);
};

// Get the BME Info every second and send to mqtt
Timer.set(1000, Timer.REPEAT, function() {
	getBmeInfo();	
	print('uptime:', Sys.uptime(), getInfo());
}, null);

// Monitor network connectivity.
Event.addGroupHandler(Net.EVENT_GRP, function(ev, evdata, arg) {
  let evs = '???';
  if (ev === Net.STATUS_DISCONNECTED) {
    evs = 'DISCONNECTED';
  } else if (ev === Net.STATUS_CONNECTING) {
    evs = 'CONNECTING';
  } else if (ev === Net.STATUS_CONNECTED) {
    evs = 'CONNECTED';
  } else if (ev === Net.STATUS_GOT_IP) {
    evs = 'GOT_IP';
  }
  print('== Net event:', ev, evs);
}, null);