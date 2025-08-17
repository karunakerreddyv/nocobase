import React from 'react';
import { useAPIClient, useForm, Form, SchemaComponent } from '@nocobase/client';
import { Button } from 'antd';

export const VerifyMfa = (props) => {
  const { userId } = props;
  const apiClient = useAPIClient();
  const form = useForm();

  const handleSubmit = async (values) => {
    await apiClient.resource('mfa').verify({ ...values, userId });
    // TODO: redirect to the home page
  };

  const schema = {
    type: 'object',
    properties: {
      code: {
        type: 'string',
        title: 'Verification Code',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
      },
    },
  };

  return (
    <Form form={form} onFinish={handleSubmit}>
      <SchemaComponent schema={schema} />
      <Button block type="primary" htmlType="submit">
        Verify
      </Button>
    </Form>
  );
};
