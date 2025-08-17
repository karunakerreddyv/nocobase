import React from 'react';
import { SchemaComponent, useFieldSchema } from '@nocobase/client';

export const Options = () => {
  const schema = useFieldSchema();
  const serviceURL = `${window.location.origin}/api/auth/cas:handleCallback?authenticator=${schema.name}`;

  const optionsSchema = {
    type: 'object',
    properties: {
      casUrl: {
        type: 'string',
        title: 'CAS Server URL',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
      },
      serviceUrl: {
        type: 'string',
        title: 'Service URL (Callback URL)',
        'x-read-only': true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {
          defaultValue: serviceURL,
        },
      },
    },
  };

  return <SchemaComponent schema={optionsSchema} />;
};
