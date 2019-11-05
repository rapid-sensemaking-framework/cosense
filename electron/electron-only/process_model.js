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
var constants_1 = require("../constants");
var utils_1 = require("../utils");
var participant_register_1 = require("./participant_register");
var run_graph_1 = require("./run_graph");
var processes = {};
var getProcesses = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, Object.values(processes)];
    });
}); };
exports.getProcesses = getProcesses;
var getProcess = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, processes[id]];
    });
}); };
exports.getProcess = getProcess;
var setProcessProp = function (id, key, value) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        console.log("updating process " + id + " value " + key + ": " + JSON.stringify(value));
        processes[id][key] = value;
        return [2 /*return*/, true];
    });
}); };
exports.setProcessProp = setProcessProp;
var newProcess = function (formInputs, templateId, template, graph, registerWsUrl) { return __awaiter(void 0, void 0, void 0, function () {
    var id, registerConfigs, participants, newProcess;
    return __generator(this, function (_a) {
        id = utils_1.guidGenerator();
        registerConfigs = {};
        participants = {};
        template.stages.forEach(function (stage) {
            stage.expectedInputs.forEach(function (expectedInput) {
                var process = expectedInput.process, port = expectedInput.port;
                if (port === constants_1.CONTACTABLE_CONFIG_PORT_NAME) {
                    var id_1 = utils_1.guidGenerator();
                    var registerConfig = getRegisterConfig(formInputs, process, id_1, registerWsUrl);
                    registerConfigs[process] = registerConfig;
                    participants[process] = []; // empty for now
                }
            });
        });
        newProcess = {
            id: id,
            templateId: templateId,
            template: template,
            graph: graph,
            configuring: true,
            running: false,
            complete: false,
            results: null,
            error: null,
            startTime: Date.now(),
            formInputs: formInputs,
            registerConfigs: registerConfigs,
            participants: participants
        };
        processes[id] = newProcess;
        console.log('created a new process configuration', newProcess);
        return [2 /*return*/, id];
    });
}); };
exports.newProcess = newProcess;
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
    var registerConfig = _a.registerConfig, callback = _a.callback;
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
                setProcessProp(processId, 'participants', participants);
                return [2 /*return*/];
        }
    });
}); };
var getHandlerInput = function (processId, expectedInput, formInputs, registerConfigs) {
    var process = expectedInput.process, port = expectedInput.port;
    if (port === constants_1.CONTACTABLE_CONFIG_PORT_NAME) {
        return {
            registerConfig: registerConfigs[process],
            callback: function (contactableConfig) {
                updateParticipants(processId, process, [contactableConfig], false);
            }
        };
    }
    return {
        input: formInputs[process + "--" + port]
    };
};
var runProcess = function (processId, runtimeAddress, runtimeSecret) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, registerConfigs, formInputs, graph, template, promises, GraphConnections, jsonGraph, dataWatcher;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, getProcess(processId)];
            case 1:
                _a = _b.sent(), registerConfigs = _a.registerConfigs, formInputs = _a.formInputs, graph = _a.graph, template = _a.template;
                promises = [];
                template.stages.forEach(function (stage) {
                    stage.expectedInputs.forEach(function (expectedInput) {
                        promises.push((function () { return __awaiter(void 0, void 0, void 0, function () {
                            var handler, handlerInput, finalInput, process, port;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        handler = mapInputToHandler(expectedInput);
                                        handlerInput = getHandlerInput(processId, expectedInput, formInputs, registerConfigs);
                                        return [4 /*yield*/, handler(handlerInput)];
                                    case 1:
                                        finalInput = _a.sent();
                                        process = expectedInput.process, port = expectedInput.port;
                                        if (port === constants_1.CONTACTABLE_CONFIG_PORT_NAME) {
                                            updateParticipants(processId, process, finalInput, true);
                                        }
                                        return [2 /*return*/, convertToGraphConnection(process, port, finalInput)];
                                }
                            });
                        }); })());
                    });
                });
                return [4 /*yield*/, Promise.all(promises)
                    // once they're all ready, now commence the process
                    // mark as running now
                ];
            case 2:
                GraphConnections = _b.sent();
                // once they're all ready, now commence the process
                // mark as running now
                setProcessProp(processId, 'configuring', false);
                setProcessProp(processId, 'running', true);
                jsonGraph = run_graph_1.overrideJsonGraph(GraphConnections, graph);
                dataWatcher = function (signal) {
                    if (signal.id === template.resultConnection) {
                        // save the results to the process
                        setProcessProp(processId, 'results', signal.data);
                    }
                };
                run_graph_1.start(jsonGraph, runtimeAddress, runtimeSecret, dataWatcher)
                    .then(function () {
                    setProcessProp(processId, 'running', false);
                    setProcessProp(processId, 'complete', true);
                }) // logs and save to memory
                ["catch"](function (e) {
                    setProcessProp(processId, 'running', false);
                    setProcessProp(processId, 'error', e);
                }); // logs and save to memory
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
/*
  // capture the results for each as they come in
  // do this in a non-blocking way
  const updatePList = async (key: string, newP: ContactableConfig, allP?: ContactableConfig[]) => {
    const old = (await getProcess(processId))[key]
    const updated = allP ? allP : [...old].concat(newP) // clone and add
    setProcessProp(processId, key, updated)
  }
  const ideationP: Promise<ContactableConfig[]> = proceedWithRegisterConfig(app, paths[0], registerConfigs[0], (newP: ContactableConfig) => {
    updatePList('ideationParticipants', newP)
  })
  const reactionP: Promise<ContactableConfig[]> = proceedWithRegisterConfig(app, paths[1], registerConfigs[1], (newP: ContactableConfig) => {
    updatePList('reactionParticipants', newP)
  })
  const summaryP: Promise<ContactableConfig[]> = proceedWithRegisterConfig(app, paths[2], registerConfigs[2], (newP: ContactableConfig) => {
    updatePList('summaryParticipants', newP)
  })
  // capture the sum results for each
  ideationP.then((ideationParticipants: ContactableConfig[]) => {
    updatePList('ideationParticipants', null, ideationParticipants)
  })
  reactionP.then((reactionParticipants: ContactableConfig[]) => {
    updatePList('reactionParticipants', null, reactionParticipants)
  })
  summaryP.then((summaryParticipants: ContactableConfig[]) => {
    updatePList('summaryParticipants', null, summaryParticipants)
  })
*/ 
//# sourceMappingURL=process_model.js.map