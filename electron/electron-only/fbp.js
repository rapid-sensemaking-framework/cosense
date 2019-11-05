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
// https://github.com/flowbased/fbp-graph/blob/master/src/Graph.coffee
// https://flowbased.github.io/fbp-protocol/
var fbpClient = require("fbp-client");
var createFbpClient = function (address, secret) { return __awaiter(void 0, void 0, void 0, function () {
    var client;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fbpClient({
                    address: address,
                    protocol: 'websocket',
                    secret: secret
                }, {
                    commandTimeout: 5000
                })];
            case 1:
                client = _a.sent();
                return [4 /*yield*/, client.connect()];
            case 2:
                _a.sent();
                return [2 /*return*/, client];
        }
    });
}); };
exports.createFbpClient = createFbpClient;
var componentMetaForStages = function (stages, graph, runtimeAddress, runtimeSecret) { return __awaiter(void 0, void 0, void 0, function () {
    var client, components;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, createFbpClient(runtimeAddress, runtimeSecret)];
            case 1:
                client = _a.sent();
                return [4 /*yield*/, client.protocol.component.list()
                    /// TODO: disconnect?
                ];
            case 2:
                components = _a.sent();
                /// TODO: disconnect?
                return [2 /*return*/, stages.map(function (stage) {
                        return __assign(__assign({}, stage), { expectedInputs: stage.expectedInputs.map(function (e) {
                                var componentName = graph.processes[e.process].component;
                                var component = components.find(function (c) { return c.name === componentName; });
                                var port = component.inPorts.find(function (i) { return i.id === e.port; });
                                return __assign(__assign({}, e), { label: e.label || port.description, type: port.type, component: componentName });
                            }) });
                    })];
        }
    });
}); };
exports.componentMetaForStages = componentMetaForStages;
/*
client.protocol = {
    component: {
        list,
        getsource,
        source
    },
    graph: {
        clear,
        addnode,
        removenode,
        renamenode,
        changenode,
        addedge,
        removeedge,
        changeedge,
addinitial,
removeinitial,
addinport,
removeinport,
renameinport,
addoutport,
removeoutport,
renameoutport,
addgroup,
removegroup,
renamegroup,
changegroup,
send
},
network: {
start,
getstatus,
stop,
persist,
debug,
edges
},
runtime: {
getruntime,
packet
},
trace: {
start,
stop,
dump,
clear
}
}
*/
/*
const graph = new fbpGraph('one-plus-one');
      graph.addNode('repeat', 'core/Repeat');
      graph.addNode('plus', 'foo/PlusOne');
      graph.addNode('output', 'core/Output');
      graph.addEdge('repeat', 'out', 'plus', 'val');
      graph.addEdge('plus', 'out', 'output', 'in');
      graph.addInitial(1, 'repeat', 'in');
      return client.protocol.graph.send(graph, true)

client.protocol.graph.addnode({
        id: 'foo',
        component: 'bar',
        graph: 'not-existing',
      })

client.protocol.network.start({
        graph: 'one-plus-one',
      })

client.protocol.network.getstatus({
        graph: 'one-plus-one',
      })

client.protocol.runtime.packet({
        graph: 'exported-plus-one',
        event: 'data',
        port: 'in',
        payload: 1,
      })

client.protocol.network.stop({
        graph: 'exported-plus-one',
      })

client.disconnect()
*/ 
//# sourceMappingURL=fbp.js.map