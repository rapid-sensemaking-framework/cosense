"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CONTACTABLE_CONFIG_PORT_NAME = 'contactable_configs';
exports.CONTACTABLE_CONFIG_PORT_NAME = CONTACTABLE_CONFIG_PORT_NAME;
var URLS = {
    DEV: {
        REGISTER: '/dev-register',
    },
    INDEX: '/',
    REGISTER: function (id) { return "/register/" + id; },
    HANDLE_REGISTER: function (pre) { return pre + "/new-participant"; },
    TEMPLATE: '/template/:templateId',
    HANDLE_TEMPLATE: '/template/:templateId/handle_template',
    PROCESS: '/process/:processId'
};
exports.URLS = URLS;
var EVENTS = {
    SEND: {
        PARTICIPANT_REGISTER: 'participant_register'
    },
    RECEIVE: {
        PARTICIPANT_REGISTER_RESULTS: 'participant_register_results',
        PARTICIPANT_REGISTER_RESULT: 'participant_register_result'
    },
    IPC: {
        PROCESS_UPDATE: function (id) { return "process_update_" + id; },
        CREATE_AND_RUN_PROCESS: 'create_and_run_process',
        PROCESS_CREATED_AND_RUN: 'process_created_and_run',
        UPDATE_TEMPLATE: 'update_template',
        TEMPLATE_UPDATED: 'template_updated',
        GET_PROCESS: 'get_process',
        RETURN_PROCESS: 'return_process',
        CLONE_PROCESS: 'clone_process',
        PROCESS_CLONED: 'process_cloned',
        CLONE_TEMPLATE: 'clone_template',
        TEMPLATE_CLONED: 'template_cloned',
        GET_PROCESSES: 'get_processes',
        RETURN_PROCESSES: 'return_processes',
        GET_TEMPLATE: 'get_template',
        RETURN_TEMPLATE: 'return_template',
        GET_TEMPLATES: 'get_templates',
        RETURN_TEMPLATES: 'return_templates',
        HANDLE_FACIL_CONTACTABLES_SUBMIT: function (id) { return "handle_facil_contactables_submit_" + id; }
    }
};
exports.EVENTS = EVENTS;
//# sourceMappingURL=constants.js.map