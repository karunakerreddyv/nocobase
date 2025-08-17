import React from 'react';
import { SchemaComponent } from '@nocobase/client';

export const Options = () => {
  const optionsSchema = {
    type: 'object',
    properties: {
      serverUrl: {
        type: 'string',
        title: 'Server URL',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {
          placeholder: 'ldap://ldap.example.com',
        },
      },
      bindDN: {
        type: 'string',
        title: 'Bind DN',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {
          placeholder: 'cn=admin,dc=example,dc=com',
        },
      },
      bindCredentials: {
        type: 'string',
        title: 'Bind Credentials',
        'x-decorator': 'FormItem',
        'x-component': 'Input.Password',
      },
      searchBase: {
        type: 'string',
        title: 'Search Base',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {
          placeholder: 'ou=users,dc=example,dc=com',
        },
      },
      searchFilter: {
        type: 'string',
        title: 'Search Filter',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {
          defaultValue: '(uid={{username}})',
        },
      },
    },
  };

  return <SchemaComponent schema={optionsSchema} />;
};
