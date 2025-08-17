import React from 'react';
import {
  Plugin,
  useCollection,
  SchemaComponent,
  useActionContext,
  useResourceActionContext,
  useResourceContext,
} from '@nocobase/client';

const transportSchema = {
  type: 'object',
  properties: {
    table: {
      'x-component': 'Table',
      'x-component-props': {
        rowKey: 'id',
        collection: 'transports',
        showIndex: true,
        dragSort: false,
      },
      properties: {
        actions: {
          type: 'void',
          'x-component': 'ActionBar',
          properties: {
            delete: {
              type: 'void',
              title: '{{ t("Delete") }}',
              'x-component': 'Action',
              'x-component-props': {
                type: 'danger',
                confirm: {
                  title: "{{ t('Delete record') }}",
                  content: "{{ t('Are you sure you want to delete it?') }}",
                },
                useAction: '{{ useDestroyAction }}',
              },
            },
            update: {
              type: 'void',
              title: '{{ t("Edit") }}',
              'x-component': 'Action.Modal',
              'x-component-props': {
                useAction: '{{ useUpdateAction }}',
              },
            },
            test: {
              type: 'void',
              title: '{{ t("Test") }}',
              'x-component': 'Action',
              'x-component-props': {
                useAction: '{{ useRequest }}',
                action: 'transports:test',
              },
              properties: {
                form: {
                  'x-component': 'Form',
                  properties: {
                    name: {
                      'x-component': 'Input',
                      title: 'Name',
                    },
                    type: {
                      'x-component': 'Select',
                      title: 'Type',
                      default: 'smtp',
                      enum: [
                        { label: 'SMTP', value: 'smtp' },
                        { label: 'Microsoft', value: 'microsoft' },
                      ],
                    },
                    'config.host': {
                      'x-component': 'Input',
                      title: 'Host',
                      'x-hidden': '{{form.values.type !== "smtp"}}',
                    },
                    'config.port': {
                      'x-component': 'InputNumber',
                      title: 'Port',
                      'x-hidden': '{{form.values.type !== "smtp"}}',
                    },
                    'config.secure': {
                      'x-component': 'Checkbox',
                      title: 'Secure',
                      'x-hidden': '{{form.values.type !== "smtp"}}',
                    },
                    'config.auth.user': {
                      'x-component': 'Input',
                      title: 'Username',
                      'x-hidden': '{{form.values.type !== "smtp"}}',
                    },
                    'config.auth.pass': {
                      'x-component': 'Password',
                      title: 'Password',
                      'x-hidden': '{{form.values.type !== "smtp"}}',
                    },
                    'config.clientId': {
                      'x-component': 'Input',
                      title: 'Client ID',
                      'x-hidden': '{{form.values.type !== "microsoft"}}',
                    },
                    'config.clientSecret': {
                      'x-component': 'Password',
                      title: 'Client Secret',
                      'x-hidden': '{{form.values.type !== "microsoft"}}',
                    },
                    'config.tenantId': {
                      'x-component': 'Input',
                      title: 'Tenant ID',
                      'x-hidden': '{{form.values.type !== "microsoft"}}',
                    },
                    default: {
                      'x-component': 'Checkbox',
                      title: 'Default',
                    },
                  },
                },
                footer: {
                  'x-component': 'Action.Modal.Footer',
                },
              },
            },
          },
        },
        name: {
          'x-component': 'CollectionField',
          'x-read-pretty': true,
        },
        type: {
          'x-component': 'CollectionField',
          'x-read-pretty': true,
        },
        default: {
          'x-component': 'CollectionField',
          'x-read-pretty': true,
        },
      },
    },
  },
};

export const TransportsTable = () => {
  return <SchemaComponent schema={transportSchema} />;
};
