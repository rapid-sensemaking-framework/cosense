declare const CONTACTABLE_CONFIG_PORT_NAME = "contactable_configs";
declare const URLS: {
    DEV: {
        REGISTER: string;
    };
    INDEX: string;
    REGISTER: (id: string) => string;
    HANDLE_REGISTER: (pre: string) => string;
    TEMPLATE: string;
    HANDLE_TEMPLATE: string;
    PROCESS: string;
};
declare const EVENTS: {
    SEND: {
        PARTICIPANT_REGISTER: string;
    };
    RECEIVE: {
        PARTICIPANT_REGISTER_RESULTS: string;
        PARTICIPANT_REGISTER_RESULT: string;
    };
    IPC: {
        PROCESS_UPDATE: (id: string) => string;
        CREATE_PROCESS: string;
        PROCESS_CREATED: string;
        RUN_PROCESS: string;
        PROCESS_RUNNING: string;
        UPDATE_TEMPLATE: string;
        TEMPLATE_UPDATED: string;
        GET_PROCESS: string;
        RETURN_PROCESS: string;
        CLONE_PROCESS: string;
        PROCESS_CLONED: string;
        CLONE_TEMPLATE: string;
        TEMPLATE_CLONED: string;
        GET_PROCESSES: string;
        RETURN_PROCESSES: string;
        GET_TEMPLATE: string;
        RETURN_TEMPLATE: string;
        GET_SYSTEM_TEMPLATES: string;
        RETURN_SYSTEM_TEMPLATES: string;
        GET_USER_TEMPLATES: string;
        RETURN_USER_TEMPLATES: string;
        CREATE_PARTICIPANT_LIST: string;
        PARTICIPANT_LIST_CREATED: string;
        UPDATE_PARTICIPANT_LIST: string;
        PARTICIPANT_LIST_UPDATED: string;
        GET_PARTICIPANT_LISTS: string;
        RETURN_PARTICIPANT_LISTS: string;
        GET_PARTICIPANT_LIST: string;
        RETURN_PARTICIPANT_LIST: string;
    };
};
export { CONTACTABLE_CONFIG_PORT_NAME, URLS, EVENTS };
