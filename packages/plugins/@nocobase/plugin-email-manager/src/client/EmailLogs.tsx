import React from 'react';
import { SchemaComponent } from '@nocobase/client';

const emailLogsSchema = {
  type: 'object',
  properties: {
    table: {
      'x-component': 'Table',
      'x-component-props': {
        rowKey: 'id',
        collection: 'email_logs',
        showIndex: true,
        dragSort: false,
      },
      properties: {
        from: {
          'x-component': 'CollectionField',
          'x-read-pretty': true,
        },
        to: {
          'x-component': 'CollectionField',
          'x-read-pretty': true,
        },
        subject: {
          'x-component': 'CollectionField',
          'x-read-pretty': true,
        },
        status: {
          'x-component': 'CollectionField',
          'x-read-pretty': true,
        },
        error: {
          'x-component': 'CollectionField',
          'x-read-pretty': true,
        },
        createdAt: {
            'x-component': 'CollectionField',
            'x-read-pretty': true,
        },
      },
    },
  },
};

export const EmailLogsTable = () => {
  return <SchemaComponent schema={emailLogsSchema} />;
};
