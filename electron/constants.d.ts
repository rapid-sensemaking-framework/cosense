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
        CREATE_AND_RUN_PROCESS: string;
        PROCESS_CREATED_AND_RUN: string;
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
        GET_TEMPLATES: string;
        RETURN_TEMPLATES: string;
        HANDLE_FACIL_CONTACTABLES_SUBMIT: (id: string) => string;
    };
};
export { CONTACTABLE_CONFIG_PORT_NAME, URLS, EVENTS };
