import React from 'react';
import { SchemaComponent, useFieldSchema } from '@nocobase/client';

export const Options = () => {
  const schema = useFieldSchema();
  const callbackURL = `${window.location.origin}/api/auth/facebook:handleCallback?authenticator=${schema.name}`;

  const optionsSchema = {
    type: 'object',
    properties: {
      clientID: {
        type: 'string',
        title: 'App ID',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
      },
      clientSecret: {
        type: 'string',
        title: 'App Secret',
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
          defaultValue: 'email',
        },
      },
      profileFields: {
        type: 'string',
        title: 'Profile Fields',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {
          defaultValue: 'id,displayName,photos,email',
        },
      }
    },
  };

  return <SchemaComponent schema={optionsSchema} />;
};
