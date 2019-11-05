"use strict";
/*
 This file is used in the frontend, and backend files, so beware what you import/require here!
*/
exports.__esModule = true;
var guidGenerator = function () {
    var S4 = function () { return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1); };
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
};
exports.guidGenerator = guidGenerator;
var remainingTime = function (maxTime, startTime) {
    var calc = (maxTime - (Date.now() - startTime) / 1000).toFixed(); // round it
    // don't bother with negative values
    return Math.max(parseInt(calc), 0);
};
exports.remainingTime = remainingTime;
var getRegister = function (env) {
    var REGISTER_HOST = env.REGISTER_HOST, REGISTER_PORT = env.REGISTER_PORT;
    return REGISTER_HOST + (REGISTER_PORT ? ":" + REGISTER_PORT : '');
};
var getRegisterAddress = function (env, protocolKey) {
    return env[protocolKey] + "://" + getRegister(env);
};
exports.getRegisterAddress = getRegisterAddress;
//# sourceMappingURL=utils.js.map