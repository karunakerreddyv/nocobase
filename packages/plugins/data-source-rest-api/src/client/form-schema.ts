import { ISchema } from '@formily/react';

export const restApiFormSchema: ISchema = {
  type: 'object',
  properties: {
    displayName: {
      type: 'string',
      title: '{{t("Display name")}}',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    baseURL: {
      type: 'string',
      title: '{{t("Base URL")}}',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
  },
};
