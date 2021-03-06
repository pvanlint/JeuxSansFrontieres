var service = "localhost:3001";
if (process.argv.length > 2)
{
    service = process.argv[2];
}

var WebSocket = require('ws');
var ws = new WebSocket("ws://"+service);
ws.onopen = function() {
  connected=true;
  var ccy1 = "EURUSD";
  var ccy2 = "USDJPY";
  console.log("Subscribing on open - " + ccy1 + " & " + ccy2);
  ws.send("Subscribe " + ccy1);
  ws.send("Subscribe " + ccy2);
  // Web Socket is connected, send data using send()
};
ws.onmessage = function (evt) {
  var received_msg = evt.data;
  if (received_msg.charAt(0) === '{') {
    console.log("Received "+received_msg);
  }
};
ws.onclose = function() {
  // websocket is closed.
  // alert("Connection is closed..."); 
};

