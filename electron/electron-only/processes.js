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
var electron = require("electron");
var path = require("path");
var fs = require("fs");
var constants_1 = require("../constants");
var utils_1 = require("../utils");
var participant_register_1 = require("./participant_register");
var run_graph_1 = require("./run_graph");
var BrowserWindow = electron.BrowserWindow;
var PROCESSES_FOLDER = 'processes';
var getProcessPath = function (processId) {
    return path.join(electron.app.getAppPath(), PROCESSES_FOLDER + "/" + processId + ".json");
};
var getProcessAsObject = function (processId) {
    var processPath = getProcessPath(processId);
    var processString = fs.readFileSync(processPath, { encoding: 'utf8' });
    var process = JSON.parse(processString);
    return process;
};
var writeProcess = function (processId, process) {
    var processPath = getProcessPath(processId);
    fs.writeFileSync(processPath, JSON.stringify(process));
};
var getProcesses = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve, reject) {
                var processesPath = path.join(electron.app.getAppPath(), PROCESSES_FOLDER);
                fs.readdir(processesPath, function (err, files) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    var templates = files.map(function (filename) {
                        return getProcessAsObject(filename.replace('.json', ''));
                    });
                    resolve(templates);
                });
            })];
    });
}); };
exports.getProcesses = getProcesses;
var getProcess = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, getProcessAsObject(id)];
    });
}); };
exports.getProcess = getProcess;
var setProcessProp = function (id, key, value) { return __awaiter(void 0, void 0, void 0, function () {
    var orig, newProcess;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                console.log("updating process " + id + " value " + key + ": " + JSON.stringify(value));
                return [4 /*yield*/, getProcess(id)];
            case 1:
                orig = _b.sent();
                newProcess = __assign(__assign({}, orig), (_a = {}, _a[key] = value, _a));
                writeProcess(id, newProcess);
                // send this updated value to any BrowserWindow that is listening
                BrowserWindow.getAllWindows().forEach(function (win) {
                    win.webContents.send(constants_1.EVENTS.IPC.PROCESS_UPDATE(id), newProcess);
                });
                return [2 /*return*/, true];
        }
    });
}); };
exports.setProcessProp = setProcessProp;
var newProcessDefaults = function () {
    return {
        id: utils_1.guidGenerator(),
        startTime: Date.now(),
        configuring: true,
        running: false,
        complete: false,
        results: null,
        error: null
    };
};
var newProcess = function (formInputs, templateId, template, graph, registerWsUrl) { return __awaiter(void 0, void 0, void 0, function () {
    var registerConfigs, participants, newProcess;
    return __generator(this, function (_a) {
        registerConfigs = {};
        participants = {};
        template.expectedInputs.forEach(function (expectedInput) {
            var process = expectedInput.process, port = expectedInput.port;
            if (port === constants_1.CONTACTABLE_CONFIG_PORT_NAME) {
                var id = utils_1.guidGenerator();
                var registerConfig = getRegisterConfig(formInputs, process, id, registerWsUrl);
                registerConfigs[process] = registerConfig;
                participants[process] = []; // empty for now
            }
        });
        newProcess = __assign(__assign({}, newProcessDefaults()), { templateId: templateId,
            template: template,
            graph: graph,
            formInputs: formInputs,
            registerConfigs: registerConfigs,
            participants: participants });
        writeProcess(newProcess.id, newProcess);
        console.log('created a new process configuration', newProcess.id);
        return [2 /*return*/, newProcess.id];
    });
}); };
exports.newProcess = newProcess;
var cloneProcess = function (processId) { return __awaiter(void 0, void 0, void 0, function () {
    var orig, newProcess;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getProcess(processId)];
            case 1:
                orig = _a.sent();
                newProcess = __assign(__assign({}, orig), newProcessDefaults());
                writeProcess(newProcess.id, newProcess);
                console.log('created a new process configuration by cloning', newProcess.id);
                return [2 /*return*/, newProcess.id];
        }
    });
}); };
exports.cloneProcess = cloneProcess;
var handleText = function (_a) {
    var input = _a.input;
    return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_b) {
            return [2 /*return*/, input];
        });
    });
};
var handleInt = function (_a) {
    var input = _a.input;
    return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_b) {
            return [2 /*return*/, parseInt(input)];
        });
    });
};
var handleArray = function (_a) {
    var input = _a.input;
    return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_b) {
            return [2 /*return*/, JSON.parse(input)];
        });
    });
};
var handleObject = function (_a) {
    var input = _a.input;
    return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_b) {
            return [2 /*return*/, JSON.parse(input)];
        });
    });
};
var handleMaxTime = function (_a) {
    var input = _a.input;
    return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_b) {
            return [2 /*return*/, parseFloat(input) * 60]; // minutes, converted to seconds
        });
    });
};
var handleOptionsData = function (_a) {
    var input = _a.input;
    return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_b) {
            // e.g. a+A=Agree, b+B=Block
            return [2 /*return*/, input
                    .split(',')
                    .map(function (s) {
                    // trim cleans white space
                    var _a = s.trim().split('='), triggersString = _a[0], text = _a[1];
                    return {
                        triggers: triggersString.split('+'),
                        text: text
                    };
                })];
        });
    });
};
exports.handleOptionsData = handleOptionsData;
var handleStatementsData = function (_a) {
    var input = _a.input;
    return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_b) {
            return [2 /*return*/, input.split('\n').map(function (s) { return ({ text: s }); })];
        });
    });
};
var handleRegisterConfig = function (_a) {
    var participants = _a.participants, registerConfig = _a.registerConfig, callback = _a.callback;
    if (participants.length > 0) {
        return Promise.resolve(participants);
    }
    var isFacilitator = registerConfig.isFacilitator, maxTime = registerConfig.maxTime, maxParticipants = registerConfig.maxParticipants, processContext = registerConfig.processContext, id = registerConfig.id, wsUrl = registerConfig.wsUrl;
    return isFacilitator ? participant_register_1.getContactablesFromFacilitator(id) : participant_register_1.getContactablesFromRegistration(wsUrl, id, maxTime, maxParticipants, processContext, callback);
};
exports.handleRegisterConfig = handleRegisterConfig;
// noflo input types
// all, string, number, int, object, array, boolean, color, date, bang, function, buffer, stream
// map these to form inputs
// allow for overrides
var nofloTypeMap = {
    string: handleText,
    number: handleText,
    int: handleInt,
    boolean: function () { },
    array: handleArray,
    object: handleObject,
    all: handleText
    // TODO: the rest
};
var specialPorts = {
    contactable_configs: handleRegisterConfig,
    statements: handleStatementsData,
    options: handleOptionsData,
    max_time: handleMaxTime
};
// TODO: create a default?
var mapInputToHandler = function (expectedInput) {
    var type = expectedInput.type, port = expectedInput.port;
    // specialPorts > basic type
    return specialPorts[port] || nofloTypeMap[type];
};
exports.mapInputToHandler = mapInputToHandler;
var convertToGraphConnection = function (process, port, data) {
    return {
        tgt: {
            process: process,
            port: port
        },
        data: data
    };
};
exports.convertToGraphConnection = convertToGraphConnection;
var updateParticipants = function (processId, name, newParticipants, overwrite) { return __awaiter(void 0, void 0, void 0, function () {
    var p, participants;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, getProcess(processId)];
            case 1:
                p = _b.sent();
                participants = __assign(__assign({}, p.participants), (_a = {}, _a[name] = overwrite ? newParticipants : p.participants[name].concat(newParticipants), _a));
                return [4 /*yield*/, setProcessProp(processId, 'participants', participants)];
            case 2:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); };
var getHandlerInput = function (processId, expectedInput, formInputs, registerConfig, participants) {
    var process = expectedInput.process, port = expectedInput.port;
    if (port === constants_1.CONTACTABLE_CONFIG_PORT_NAME) {
        return {
            participants: participants,
            registerConfig: registerConfig,
            callback: function (contactableConfig) {
                updateParticipants(processId, process, [contactableConfig], false);
            }
        };
    }
    return {
        input: formInputs[process + "--" + port]
    };
};
var resolveExpectedInput = function (expectedInput, processId, formInputs, registerConfig, participants) { return __awaiter(void 0, void 0, void 0, function () {
    var process, port, handler, handlerInput, finalInput;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                process = expectedInput.process, port = expectedInput.port;
                handler = mapInputToHandler(expectedInput);
                handlerInput = getHandlerInput(processId, expectedInput, formInputs, registerConfig, participants);
                return [4 /*yield*/, handler(handlerInput)];
            case 1:
                finalInput = _a.sent();
                if (port === constants_1.CONTACTABLE_CONFIG_PORT_NAME) {
                    updateParticipants(processId, process, finalInput, true);
                }
                return [2 /*return*/, finalInput];
        }
    });
}); };
var runProcess = function (processId, runtimeAddress, runtimeSecret) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, registerConfigs, formInputs, graph, template, participants, resolveAndConvert, promises, graphConnections, jsonGraph, dataWatcher;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, getProcess(processId)];
            case 1:
                _a = _b.sent(), registerConfigs = _a.registerConfigs, formInputs = _a.formInputs, graph = _a.graph, template = _a.template, participants = _a.participants;
                resolveAndConvert = function (expectedInput) { return __awaiter(void 0, void 0, void 0, function () {
                    var process, port, finalInput;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                process = expectedInput.process, port = expectedInput.port;
                                return [4 /*yield*/, resolveExpectedInput(expectedInput, processId, formInputs, registerConfigs[process], participants[process])];
                            case 1:
                                finalInput = _a.sent();
                                return [2 /*return*/, convertToGraphConnection(process, port, finalInput)];
                        }
                    });
                }); };
                promises = template.expectedInputs.map(resolveAndConvert);
                return [4 /*yield*/, Promise.all(promises)
                    // once they're all ready, now commence the process
                    // mark as running now
                ];
            case 2:
                graphConnections = _b.sent();
                // once they're all ready, now commence the process
                // mark as running now
                return [4 /*yield*/, setProcessProp(processId, 'configuring', false)];
            case 3:
                // once they're all ready, now commence the process
                // mark as running now
                _b.sent();
                return [4 /*yield*/, setProcessProp(processId, 'running', true)];
            case 4:
                _b.sent();
                jsonGraph = run_graph_1.overrideJsonGraph(graphConnections, graph);
                dataWatcher = function (signal) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!(signal.id === template.resultConnection)) return [3 /*break*/, 4];
                                // save the results to the process
                                return [4 /*yield*/, setProcessProp(processId, 'results', signal.data)];
                            case 1:
                                // save the results to the process
                                _a.sent();
                                return [4 /*yield*/, setProcessProp(processId, 'running', false)];
                            case 2:
                                _a.sent();
                                return [4 /*yield*/, setProcessProp(processId, 'complete', true)];
                            case 3:
                                _a.sent();
                                _a.label = 4;
                            case 4: return [2 /*return*/];
                        }
                    });
                }); };
                run_graph_1.start(jsonGraph, runtimeAddress, runtimeSecret, dataWatcher)["catch"](function (e) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, setProcessProp(processId, 'running', false)];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, setProcessProp(processId, 'error', e)];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); }); // logs and save to memory
                return [2 /*return*/];
        }
    });
}); };
exports.runProcess = runProcess;
var getRegisterConfig = function (formInputs, process, id, wsUrl) {
    return {
        stage: process,
        isFacilitator: formInputs[process + "-check-facil_register"] === 'facil_register',
        processContext: formInputs[process + "-ParticipantRegister-process_context"] || process,
        maxTime: (parseFloat(formInputs[process + "-ParticipantRegister-max_time"]) || 5) * 60,
        maxParticipants: formInputs[process + "-ParticipantRegister-max_participants"] || '*',
        id: id,
        wsUrl: wsUrl
    };
};
exports.getRegisterConfig = getRegisterConfig;
//# sourceMappingURL=processes.js.map