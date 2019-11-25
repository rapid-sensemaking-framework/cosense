import { Template, TemplateSubmitInput, UpdateTemplateInput } from '../types';
declare const updateTemplate: ({ name, description, expectedInputs, templateId }: UpdateTemplateInput) => Promise<boolean>;
declare const createProcess: ({ inputs, templateId, template }: TemplateSubmitInput) => Promise<string>;
declare const getTemplates: (userDefined?: boolean) => Promise<Template[]>;
declare const getTemplate: (templateId: string, userDefined: boolean, runtimeAddress: string, runtimeSecret: string) => Promise<Template>;
declare const cloneTemplate: (templateId: string, userDefined?: boolean) => Promise<string>;
export { updateTemplate, createProcess, getTemplates, getTemplate, cloneTemplate };
