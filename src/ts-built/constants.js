"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CONTACTABLE_CONFIG_PORT_NAME = 'contactable_configs';
exports.CONTACTABLE_CONFIG_PORT_NAME = CONTACTABLE_CONFIG_PORT_NAME;
var URLS = {
    DEV: {
        REGISTER: '/dev-register'
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
        CREATE_PROCESS: 'create_process',
        PROCESS_CREATED: 'process_created',
        RUN_PROCESS: 'run_process',
        PROCESS_RUNNING: 'process_running',
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
        GET_SYSTEM_TEMPLATES: 'get_system_templates',
        RETURN_SYSTEM_TEMPLATES: 'return_system_templates',
        GET_USER_TEMPLATES: 'get_user_templates',
        RETURN_USER_TEMPLATES: 'return_user_templates',
        CREATE_PARTICIPANT_LIST: 'create_participant_list',
        PARTICIPANT_LIST_CREATED: 'participant_list_created',
        UPDATE_PARTICIPANT_LIST: 'update_participant_list',
        PARTICIPANT_LIST_UPDATED: 'participant_list_updated',
        GET_PARTICIPANT_LISTS: 'get_participant_lists',
        RETURN_PARTICIPANT_LISTS: 'return_participant_lists',
        GET_PARTICIPANT_LIST: 'get_participant_list',
        RETURN_PARTICIPANT_LIST: 'return_participant_list'
    }
};
exports.EVENTS = EVENTS;
//# sourceMappingURL=constants.js.map