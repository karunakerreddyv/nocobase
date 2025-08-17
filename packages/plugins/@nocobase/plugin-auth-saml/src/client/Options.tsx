import React from 'react';
import { SchemaComponent, useFieldSchema } from '@nocobase/client';

export const Options = () => {
  const schema = useFieldSchema();
  const callbackURL = `${window.location.origin}/api/auth/saml:handleCallback?authenticator=${schema.name}`;

  const optionsSchema = {
    type: 'object',
    properties: {
      entryPoint: {
        type: 'string',
        title: 'Identity Provider SSO URL',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
      },
      issuer: {
        type: 'string',
        title: 'Issuer (Service Provider Entity ID)',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
      },
      cert: {
        type: 'string',
        title: 'Identity Provider Certificate (Base64)',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input.TextArea',
      },
      callbackUrl: {
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
