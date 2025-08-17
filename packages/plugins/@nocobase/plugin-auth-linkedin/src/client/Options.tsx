import React from 'react';
import { SchemaComponent, useFieldSchema } from '@nocobase/client';

export const Options = () => {
  const schema = useFieldSchema();
  const callbackURL = `${window.location.origin}/api/auth/linkedin:handleCallback?authenticator=${schema.name}`;

  const optionsSchema = {
    type: 'object',
    properties: {
      clientID: {
        type: 'string',
        title: 'Client ID',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
      },
      clientSecret: {
        type: 'string',
        title: 'Client Secret',
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
      scope: {
        type: 'string',
        title: 'Scope',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {
          defaultValue: 'r_emailaddress r_liteprofile',
        },
      },
    },
  };

  return <SchemaComponent schema={optionsSchema} />;
};
