import React from 'react';
import { SchemaComponent, useForm, Form, Application } from '@nocobase/client';
import { Button } from 'antd';

export const SigninForm = (props) => {
  const { authenticator } = props;
  const form = useForm();
  const app = React.useContext(Application.Context);

  const handleSubmit = async (values) => {
    await app.authManager.signIn(authenticator.name, values);
  };

  const schema = {
    type: 'object',
    properties: {
      username: {
        type: 'string',
        title: 'Username',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
      },
      password: {
        type: 'string',
        title: 'Password',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input.Password',
      },
    },
  };

  return (
    <Form form={form} onFinish={handleSubmit}>
      <SchemaComponent schema={schema} />
      <Button block type="primary" htmlType="submit">
        Sign in
      </Button>
    </Form>
  );
};
