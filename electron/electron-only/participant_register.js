"use strict";
exports.__esModule = true;
var electron = require("electron");
var socketClient = require("socket.io-client");
var constants_1 = require("../constants");
var ipc = electron.ipcMain;
// ipc local
var getContactablesFromFacilitator = function (id) {
    return new Promise(function (resolve) {
        ipc.once(constants_1.EVENTS.IPC.HANDLE_FACIL_CONTACTABLES_SUBMIT(id), function (event, contactableConfigs) {
            resolve(contactableConfigs);
            // synchronously return
            event.returnValue = true;
        });
    });
};
exports.getContactablesFromFacilitator = getContactablesFromFacilitator;
// websockets to remote
var getContactablesFromRegistration = function (wsUrl, id, maxTime, maxParticipants, processDescription, eachNew // set default
) {
    if (eachNew === void 0) { eachNew = function () { }; }
    return new Promise(function (resolve) {
        // TODO: handle timeout
        // capture the process kickoff time for reference
        // const startTime = Date.now()
        var socket = socketClient(wsUrl);
        socket.on('connect', function () {
            // initialize it
            socket.emit(constants_1.EVENTS.SEND.PARTICIPANT_REGISTER, {
                id: id,
                maxParticipants: maxParticipants,
                maxTime: maxTime,
                processDescription: processDescription
            });
        });
        // single one
        socket.on(constants_1.EVENTS.RECEIVE.PARTICIPANT_REGISTER_RESULT, eachNew);
        // all results
        socket.on(constants_1.EVENTS.RECEIVE.PARTICIPANT_REGISTER_RESULTS, resolve);
    });
};
exports.getContactablesFromRegistration = getContactablesFromRegistration;
//# sourceMappingURL=participant_register.js.map