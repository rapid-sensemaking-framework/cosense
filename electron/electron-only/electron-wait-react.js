"use strict";
exports.__esModule = true;
var net = require("net");
var port = process.env.PORT ? (parseInt(process.env.PORT) - 100) : 3000;
process.env.ELECTRON_START_URL = "http://localhost:" + port;
var client = new net.Socket();
var startedElectron = false;
var tryConnection = function () { return client.connect({ port: port }, function () {
    client.end();
    if (!startedElectron) {
        console.log('starting electron');
        startedElectron = true;
        var exec = require('child_process').exec;
        var electron = exec('npm run electron');
        electron.stdout.on("data", function (data) {
            console.log("stdout: " + data.toString());
        });
    }
}); };
tryConnection();
client.on('error', function (error) {
    setTimeout(tryConnection, 1000);
});
//# sourceMappingURL=electron-wait-react.js.map