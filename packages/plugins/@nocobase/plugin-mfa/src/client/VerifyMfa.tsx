import React from 'react';
import { useAPIClient, useForm, Form, SchemaComponent } from '@nocobase/client';
import { Button, message } from 'antd';

export const VerifyMfa = (props) => {
  const { userId, closeModal } = props;
  const apiClient = useAPIClient();
  const form = useForm();

  const handleSubmit = async (values) => {
    try {
      const { data } = await apiClient.resource('mfa').verify({ ...values, userId });
      // After successful verification, the server returns a new token.
      // We need to update the token in the client.
      apiClient.auth.setToken(data.token);
      message.success('Verification successful');
      if (closeModal) {
        closeModal();
      }
      // Reload the page to get the new user state
      window.location.reload();
    } catch (error) {
      message.error('Invalid verification code');
    }
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
