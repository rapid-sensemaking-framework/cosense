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
var processes_1 = require("./processes");
var utils_1 = require("../utils");
var fbp_1 = require("./fbp");
var TEMPLATES_FOLDER = 'templates';
var getGraph = function (graphName) {
    var graphPath = path.join(electron.app.getAppPath(), "graphs/" + graphName);
    return require(graphPath);
};
var getTemplatePath = function (templateId) {
    return path.join(electron.app.getAppPath(), TEMPLATES_FOLDER + "/" + templateId + ".template.json");
};
var getTemplateAsObject = function (templateId) {
    var templatePath = getTemplatePath(templateId);
    var templateString = fs.readFileSync(templatePath, { encoding: "utf8" });
    var template = JSON.parse(templateString);
    return template;
};
var writeTemplate = function (templateId, template) {
    var templatePath = getTemplatePath(templateId);
    fs.writeFileSync(templatePath, JSON.stringify(template));
};
var updateTemplate = function (_a) {
    var name = _a.name, description = _a.description, expectedInputs = _a.expectedInputs, templateId = _a.templateId;
    return __awaiter(void 0, void 0, void 0, function () {
        var orig, newTemplate;
        return __generator(this, function (_b) {
            orig = getTemplateAsObject(templateId);
            newTemplate = __assign(__assign({}, orig), { name: name,
                description: description, stages: orig.stages.map(function (stage) {
                    return __assign(__assign({}, stage), { expectedInputs: stage.expectedInputs.map(function (e) {
                            // TODO consolidate references like these
                            var key = e.process + "--" + e.port;
                            var defaultValue = expectedInputs[key];
                            if (defaultValue) {
                                return __assign(__assign({}, e), { defaultValue: defaultValue });
                            }
                            else {
                                return e;
                            }
                        }) });
                }) });
            writeTemplate(templateId, newTemplate);
            return [2 /*return*/, true];
        });
    });
};
exports.updateTemplate = updateTemplate;
// TODO: should this be in processes file?
var handleTemplateSubmit = function (_a) {
    var inputs = _a.inputs, templateId = _a.templateId, template = _a.template;
    return __awaiter(void 0, void 0, void 0, function () {
        var registerWsUrl, graph, processId, runtimeAddress, runtimeSecret;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    registerWsUrl = utils_1.getRegisterAddress(process.env, 'REGISTER_WS_PROTOCOL');
                    graph = getGraph(template.graphName);
                    return [4 /*yield*/, processes_1.newProcess(inputs, templateId, template, graph, registerWsUrl)
                        // kick it off, but don't wait on it, or depend on it for anything
                    ];
                case 1:
                    processId = _b.sent();
                    runtimeAddress = process.env.RUNTIME_ADDRESS;
                    runtimeSecret = process.env.RUNTIME_SECRET;
                    processes_1.runProcess(processId, runtimeAddress, runtimeSecret);
                    return [2 /*return*/, processId];
            }
        });
    });
};
exports.handleTemplateSubmit = handleTemplateSubmit;
var getTemplates = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve, reject) {
                var templatesPath = path.join(electron.app.getAppPath(), TEMPLATES_FOLDER);
                fs.readdir(templatesPath, function (err, files) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    var templates = files.map(function (filename) {
                        var templatePath = path.join(electron.app.getAppPath(), TEMPLATES_FOLDER + "/" + filename);
                        var template = JSON.parse(fs.readFileSync(templatePath, { encoding: 'utf8' }));
                        var shortName = filename.replace('.template.json', '');
                        // react router route
                        template.path = "/template/" + shortName;
                        return template;
                    });
                    resolve(templates);
                });
            })];
    });
}); };
exports.getTemplates = getTemplates;
var getTemplate = function (templateId, runtimeAddress, runtimeSecret) { return __awaiter(void 0, void 0, void 0, function () {
    var template, reactPath, stages, graph;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                try {
                    template = getTemplateAsObject(templateId);
                }
                catch (e) {
                    console.log(e);
                }
                if (!template) return [3 /*break*/, 2];
                // react router route
                reactPath = "/template/" + templateId;
                graph = getGraph(template.graphName);
                return [4 /*yield*/, fbp_1.componentMetaForStages(template.stages, graph, runtimeAddress, runtimeSecret)];
            case 1:
                stages = _a.sent();
                _a.label = 2;
            case 2: return [2 /*return*/, __assign(__assign({}, template), { path: reactPath, stages: stages })];
        }
    });
}); };
exports.getTemplate = getTemplate;
var cloneTemplate = function (templateId) { return __awaiter(void 0, void 0, void 0, function () {
    var orig, newGuid, id, name, newTemplate;
    return __generator(this, function (_a) {
        orig = getTemplateAsObject(templateId);
        newGuid = utils_1.guidGenerator();
        id = orig.id + '-' + newGuid;
        name = orig.name + '-' + newGuid.slice(0, 5);
        newTemplate = __assign(__assign({}, orig), { id: id,
            name: name, parentTemplate: orig.id });
        writeTemplate(id, newTemplate);
        return [2 /*return*/, newTemplate.id];
    });
}); };
exports.cloneTemplate = cloneTemplate;
//# sourceMappingURL=templates.js.map