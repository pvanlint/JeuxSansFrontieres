var nr = require('newrelic');

var port = 3001;
if (process.argv.length > 2)
{
    port = process.argv[2];
}

var connections=[];

var os = require("os");
var hostname = os.hostname();

//var rates = ["AUDUSD","USDCAD","USDCNY","EURUSD","GBPUSD","USDINR","USDJPY"];
var currency = {
    "AUDUSD":{"rate":1.0,"subs":[]},
    "USDCAD":{"rate":1.0,"subs":[]},
    "USDCNY":{"rate":1.0,"subs":[]},
    "EURUSD":{"rate":1.0,"subs":[]},
    "GBPUSD":{"rate":1.0,"subs":[]},
    "USDINR":{"rate":1.0,"subs":[]},
    "USDJPY":{"rate":1.0,"subs":[]}
};

var t_update = {
    "sum":0,
    "count":0
};

var addon = require('./build/Release/addon');

function update(ccy, subs) {
    var newrate = addon.getRate(ccy);
    var len=subs.length;
    for (var i=0; i<len; ++i)
    {
        if (subs[i]===1) {
            var otherws=connections[i];
            if (otherws !== undefined) {
                otherws.send('{"'+ccy+'":'+newrate.toFixed(6)+'}');
            }
        }
    }
    return newrate;
}

function updates() {
    var start = process.hrtime();
    for (var ccy in currency) {
        if (currency.hasOwnProperty(prop)) {
            //console.log("Updating: ", ccy);
            var entry = currency[ccy];
            currency[ccy].rate = update(ccy, entry.subs);
        }
    }
    var duration = process.hrtime(start)[1] / 1000000;
    t_update.sum += duration;
    t_update.count++;
}

var os = require('os');
var ifaces = os.networkInterfaces();

function getIp() {
    var ip;
    Object.keys(ifaces).forEach(function (ifname) {
        var alias = 0;

        ifaces[ifname].forEach(function (iface) {
            if ('IPv4' === iface.family && iface.internal === false && alias === 0) {
                alias++;
                ip = iface.address;
            }
        });
    });
    return ip;
}


var ctrl = setInterval(updates, 100);
var running = true;

var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port: port});
var service = getIp() + ":" + port;
console.log("Running on ", service, " - ", hostname, " for ", getIp());
console.log("Service: ", service);

wss.on('connection', function(ws) {
    var idx = connections.push(ws) - 1;
    nr.incrementMetric('Custom/Connection');
    console.log(idx);
    ws.on('message', function(message) {
        var assets;
        var asset;
        console.log(idx + ': Received: %s', message);
        if (message.substr(0, 10) === "Subscribe ")
        {
            nr.incrementMetric('Custom/Subscription');
            assets = message.substr(10).split(",");
            for (var i in assets) {
                asset = assets[i];
                ws.send('Subscribed '+asset+' on '+hostname);
                if (currency[asset] !== undefined)
                {
                    var newrate = addon.getRate(asset);
                    ws.send('{"'+asset+'":'+newrate.toFixed(6)+'}');
                    console.log(idx + ": Subscribed to " + asset);
                    currency[asset].subs[idx] = 1;
                }
                else {
                    console.log(idx + ": Subscribe failed: %s unknown asset", asset);
                }
            }
        }
        else if (message.substr(0, 12) === "Unsubscribe ")
        {
            assets = message.substr(12).split(",");
            for (var i in assets) {
                asset = assets[i];
                if (currency[asset] !== undefined)
                {
                    console.log(idx + ": Unubscribed to " + asset);
                    currency[asset].subs[idx] = 0;
                }
                else {
                    console.log(idx + ": Unsubscribe failed: " + asset + " unknown asset");
                }
            }
        }
        else if (message.substr(0, 5) === "Start")
        {
            if (running) {
                ws.send("Already running");
            }
            else {
                var interval=1000;
                if (message.substr(0, 6) === "Start ") {
                    interval = message.substr(6);
                }
                ctrl = setInterval(updates, parseInt(interval));
                running = true;
                ws.send("Started");
            }
        }
        else if (message.substr(0, 4) === "Stop")
        {
            if (!running) {
                ws.send("Not running");
            }
            else {
                clearInterval(ctrl);
                running = false;
                ws.send("Stopped");
                if (t_update.count > 0) {
                    console.log(t_update.count.toString()+" => " + (t_update.sum/t_update.count).toFixed(3));
                }
                t_update.sum=0;
                t_update.count=0;
            }
        }
/*
        var len=connections.length;
        for (i=0; i<len; ++i)
        {
            var otherws=connections[i];
            if (otherws === undefined)
            {
                console.log("Dead connection");
            }
            else
            {
                otherws.send(message);
            }
        }
*/
    });
    ws.on('close', function(message) {
        delete connections[idx];
        for (var ccy in currency) {
            var subs = currency[ccy].subs;
            var len=subs.length;
            for (var i=0; i<len; ++i)
            {
                if (subs[i]!==undefined) {
                    delete subs[i];
                }
            }
        }
        console.log(idx + ': Disconnected');
    });
    ws.send('Connected');
});

