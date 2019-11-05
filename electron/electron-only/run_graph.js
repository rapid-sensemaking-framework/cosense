"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var fbpGraph = require("fbp-graph");
var fbp_1 = require("./fbp");
var start = function (jsonGraph, runtimeAddress, runtimeSecret, dataWatcher) {
    if (dataWatcher === void 0) { dataWatcher = function (signal) { }; }
    return __awaiter(void 0, void 0, void 0, function () {
        var client;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fbp_1.createFbpClient(runtimeAddress, runtimeSecret)
                    /// TODO: disconnect?
                ];
                case 1:
                    client = _a.sent();
                    /// TODO: disconnect?
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            fbpGraph.graph.loadJSON(jsonGraph, function (err, graph) { return __awaiter(void 0, void 0, void 0, function () {
                                var observer, e_1, signals, stopped, error, processError;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (err) {
                                                reject(err);
                                                return [2 /*return*/];
                                            }
                                            return [4 /*yield*/, client.protocol.graph.send(graph, true)];
                                        case 1:
                                            _a.sent();
                                            observer = client.observe(['network:*']);
                                            _a.label = 2;
                                        case 2:
                                            _a.trys.push([2, 4, , 5]);
                                            return [4 /*yield*/, client.protocol.network.start({
                                                    graph: graph.name
                                                })];
                                        case 3:
                                            _a.sent();
                                            return [3 /*break*/, 5];
                                        case 4:
                                            e_1 = _a.sent();
                                            if (e_1.toString() !== 'Error: network:start timed out')
                                                reject(e_1);
                                            return [3 /*break*/, 5];
                                        case 5:
                                            // forward each network data signal for this specific graph
                                            client.on('network', function (signal) {
                                                if (signal.command === 'data' && signal.payload.graph === graph.name) {
                                                    // just forward the payload itself, as other meta is assumed
                                                    dataWatcher(signal.payload);
                                                }
                                            });
                                            return [4 /*yield*/, observer.until(['network:stopped'], ['network:error', 'network:processerror'])];
                                        case 6:
                                            signals = _a.sent();
                                            stopped = signals.find(function (signal) { return signal.command === 'stopped' && signal.payload.graph === graph.name; });
                                            error = signals.find(function (signal) { return signal.command === 'error' && signal.payload.graph === graph.name; });
                                            processError = signals.find(function (signal) { return signal.command === 'processerror' && signal.payload.graph === graph.name; });
                                            if (stopped)
                                                resolve();
                                            else
                                                reject(error || processError);
                                            return [2 /*return*/];
                                    }
                                });
                            }); });
                        })];
            }
        });
    });
};
exports.start = start;
var overrideJsonGraph = function (graphConnections, graph) {
    // most relevant connections are inputs
    var connections = graph.connections.map(function (connection) {
        var foundOverride = graphConnections.find(function (input) {
            return input.tgt.process === connection.tgt.process && input.tgt.port === connection.tgt.port;
        });
        return foundOverride || connection;
    });
    var modifiedGraph = __assign(__assign({}, graph), { 
        // override the name, give a unique name to this graph
        properties: __assign(__assign({}, graph.properties), { name: Math.random() * 100 + "randomid" }), 
        // override the connections, or inputs
        connections: connections });
    return modifiedGraph;
};
exports.overrideJsonGraph = overrideJsonGraph;
//# sourceMappingURL=run_graph.js.map