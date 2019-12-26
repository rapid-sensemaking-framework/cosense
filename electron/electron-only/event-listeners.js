"use strict";
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
var ipc = electron.ipcMain;
var constants_1 = require("../constants");
var participant_lists_1 = require("./participant-lists");
var templates_1 = require("./templates");
var processes_1 = require("./processes");
var IPC = constants_1.EVENTS.IPC;
// TODO handle failure cases
var attachEventListeners = function () {
    /*
      PROCESSES
    */
    ipc.on(IPC.CREATE_PROCESS, function (event, data) { return __awaiter(void 0, void 0, void 0, function () {
        var processId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, templates_1.createProcess(data)];
                case 1:
                    processId = _a.sent();
                    event.sender.send(IPC.PROCESS_CREATED, processId);
                    return [2 /*return*/];
            }
        });
    }); });
    ipc.on(IPC.RUN_PROCESS, function (event, processId) { return __awaiter(void 0, void 0, void 0, function () {
        var runtimeAddress, runtimeSecret;
        return __generator(this, function (_a) {
            runtimeAddress = process.env.RUNTIME_ADDRESS;
            runtimeSecret = process.env.RUNTIME_SECRET;
            // start process, but don't wait for it before returning
            processes_1.runProcess(processId, runtimeAddress, runtimeSecret);
            event.sender.send(IPC.PROCESS_RUNNING);
            return [2 /*return*/];
        });
    }); });
    ipc.on(IPC.CLONE_PROCESS, function (event, processId) { return __awaiter(void 0, void 0, void 0, function () {
        var newProcessId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, processes_1.cloneProcess(processId)];
                case 1:
                    newProcessId = _a.sent();
                    event.sender.send(IPC.PROCESS_CLONED, newProcessId);
                    return [2 /*return*/];
            }
        });
    }); });
    ipc.on(IPC.GET_PROCESS, function (event, processId) { return __awaiter(void 0, void 0, void 0, function () {
        var process;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, processes_1.getProcess(processId)];
                case 1:
                    process = _a.sent();
                    event.sender.send(IPC.RETURN_PROCESS, process);
                    return [2 /*return*/];
            }
        });
    }); });
    ipc.on(IPC.GET_PROCESSES, function (event) { return __awaiter(void 0, void 0, void 0, function () {
        var processes;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, processes_1.getProcesses()];
                case 1:
                    processes = _a.sent();
                    event.sender.send(IPC.RETURN_PROCESSES, processes);
                    return [2 /*return*/];
            }
        });
    }); });
    /*
      TEMPLATES
    */
    ipc.on(IPC.UPDATE_TEMPLATE, function (event, data) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, templates_1.updateTemplate(data)];
                case 1:
                    _a.sent();
                    event.sender.send(IPC.TEMPLATE_UPDATED);
                    return [2 /*return*/];
            }
        });
    }); });
    ipc.on(IPC.CLONE_TEMPLATE, function (event, templateId) { return __awaiter(void 0, void 0, void 0, function () {
        var newTemplateId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, templates_1.cloneTemplate(templateId)];
                case 1:
                    newTemplateId = _a.sent();
                    event.sender.send(IPC.TEMPLATE_CLONED, newTemplateId);
                    return [2 /*return*/];
            }
        });
    }); });
    ipc.on(IPC.GET_SYSTEM_TEMPLATES, function (event) { return __awaiter(void 0, void 0, void 0, function () {
        var templates;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, templates_1.getTemplates(false)];
                case 1:
                    templates = _a.sent();
                    event.sender.send(IPC.RETURN_SYSTEM_TEMPLATES, templates);
                    return [2 /*return*/];
            }
        });
    }); });
    ipc.on(IPC.GET_USER_TEMPLATES, function (event) { return __awaiter(void 0, void 0, void 0, function () {
        var templates;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, templates_1.getTemplates(true)];
                case 1:
                    templates = _a.sent();
                    event.sender.send(IPC.RETURN_USER_TEMPLATES, templates);
                    return [2 /*return*/];
            }
        });
    }); });
    ipc.on(IPC.GET_TEMPLATE, function (event, data) { return __awaiter(void 0, void 0, void 0, function () {
        var templateId, userDefined, runtimeAddress, runtimeSecret, template;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    templateId = data.templateId, userDefined = data.userDefined;
                    runtimeAddress = process.env.RUNTIME_ADDRESS;
                    runtimeSecret = process.env.RUNTIME_SECRET;
                    return [4 /*yield*/, templates_1.getTemplate(templateId, userDefined, runtimeAddress, runtimeSecret)];
                case 1:
                    template = _a.sent();
                    event.sender.send(IPC.RETURN_TEMPLATE, template);
                    return [2 /*return*/];
            }
        });
    }); });
    /*
      PARTICIPANT LISTS
    */
    ipc.on(IPC.CREATE_PARTICIPANT_LIST, function (event, data) { return __awaiter(void 0, void 0, void 0, function () {
        var slug;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, participant_lists_1.createParticipantList(data)];
                case 1:
                    slug = _a.sent();
                    event.sender.send(IPC.PARTICIPANT_LIST_CREATED, slug);
                    return [2 /*return*/];
            }
        });
    }); });
    ipc.on(IPC.UPDATE_PARTICIPANT_LIST, function (event, data) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, participant_lists_1.updateParticipantList(data)];
                case 1:
                    _a.sent();
                    event.sender.send(IPC.PARTICIPANT_LIST_UPDATED);
                    return [2 /*return*/];
            }
        });
    }); });
    ipc.on(IPC.GET_PARTICIPANT_LIST, function (event, slug) { return __awaiter(void 0, void 0, void 0, function () {
        var partipantList;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, participant_lists_1.getParticipantList(slug)];
                case 1:
                    partipantList = _a.sent();
                    event.sender.send(IPC.RETURN_PARTICIPANT_LIST, partipantList);
                    return [2 /*return*/];
            }
        });
    }); });
    ipc.on(IPC.GET_PARTICIPANT_LISTS, function (event) { return __awaiter(void 0, void 0, void 0, function () {
        var participantLists;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, participant_lists_1.getParticipantLists()];
                case 1:
                    participantLists = _a.sent();
                    event.sender.send(IPC.RETURN_PARTICIPANT_LISTS, participantLists);
                    return [2 /*return*/];
            }
        });
    }); });
};
exports["default"] = attachEventListeners;
//# sourceMappingURL=event-listeners.js.map