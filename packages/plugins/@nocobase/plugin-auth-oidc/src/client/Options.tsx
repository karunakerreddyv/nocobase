import React from 'react';
import { SchemaComponent, useFieldSchema } from '@nocobase/client';

export const Options = () => {
  const schema = useFieldSchema();
  const callbackURL = `${window.location.origin}/api/auth/oidc:handleCallback?authenticator=${schema.name}`;

  const optionsSchema = {
    type: 'object',
    properties: {
      issuer: {
        type: 'string',
        title: 'Issuer URL',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
      },
      authorizationURL: {
        type: 'string',
        title: 'Authorization URL',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
      },
      tokenURL: {
        type: 'string',
        title: 'Token URL',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
      },
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
          defaultValue: 'openid profile email',
        },
      },
    },
  };

  return <SchemaComponent schema={optionsSchema} />;
};
