import { Template } from '../types';
declare const updateTemplate: ({ name, description, expectedInputs, templateId }: {
    name: string;
    description: string;
    expectedInputs: any;
    templateId: string;
}) => Promise<boolean>;
declare const handleTemplateSubmit: ({ inputs, templateId, template }: {
    inputs: any;
    templateId: string;
    template: Template;
}) => Promise<string>;
declare const getTemplates: () => Promise<Template[]>;
declare const getTemplate: (templateId: string, runtimeAddress: string, runtimeSecret: string) => Promise<Template>;
declare const cloneTemplate: (templateId: any) => Promise<string>;
export { updateTemplate, handleTemplateSubmit, getTemplates, getTemplate, cloneTemplate };
