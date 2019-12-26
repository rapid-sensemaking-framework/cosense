"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var isRenderer = typeof window !== 'undefined';
var app = isRenderer
    ? window.require('electron').remote.app
    : require('electron').app;
var path = isRenderer
    ? window.require('electron').remote.require('path')
    : require('path');
var APP_DATA = 'CoSense';
var APP_DATA_PATH = path.join(app.getPath('appData'), APP_DATA);
exports.APP_DATA_PATH = APP_DATA_PATH;
var USER_PROCESSES_PATH = path.join(APP_DATA_PATH, 'processes');
exports.USER_PROCESSES_PATH = USER_PROCESSES_PATH;
var USER_TEMPLATES_PATH = path.join(APP_DATA_PATH, 'templates');
exports.USER_TEMPLATES_PATH = USER_TEMPLATES_PATH;
var SYSTEM_TEMPLATES_PATH = path.join(app.getAppPath(), 'templates');
exports.SYSTEM_TEMPLATES_PATH = SYSTEM_TEMPLATES_PATH;
var SYSTEM_GRAPHS_PATH = path.join(app.getAppPath(), 'graphs');
exports.SYSTEM_GRAPHS_PATH = SYSTEM_GRAPHS_PATH;
var PARTICIPANT_LISTS_PATH = path.join(APP_DATA_PATH, 'participant_lists');
exports.PARTICIPANT_LISTS_PATH = PARTICIPANT_LISTS_PATH;
//# sourceMappingURL=folders.js.map