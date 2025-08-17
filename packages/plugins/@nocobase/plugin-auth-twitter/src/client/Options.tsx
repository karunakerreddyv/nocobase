import React from 'react';
import { SchemaComponent, useFieldSchema } from '@nocobase/client';

export const Options = () => {
  const schema = useFieldSchema();
  const callbackURL = `${window.location.origin}/api/auth/twitter:handleCallback?authenticator=${schema.name}`;

  const optionsSchema = {
    type: 'object',
    properties: {
      consumerKey: {
        type: 'string',
        title: 'API Key',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
      },
      consumerSecret: {
        type: 'string',
        title: 'API Key Secret',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
      },
      callbackURL: {
        type: 'string',
        title: 'Callback URL',
        'x-read-only': true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {
          defaultValue: callbackURL,
        },
      },
    },
  };

  return <SchemaComponent schema={optionsSchema} />;
};
