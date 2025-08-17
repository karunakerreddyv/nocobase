import React, { useState, useEffect } from 'react';
import { useAPIClient, useForm, Form, SchemaComponent } from '@nocobase/client';
import { Button, Spin, Alert, Typography } from 'antd';

const { Paragraph } = Typography;

export const EnableMfa = () => {
  const [loading, setLoading] = useState(true);
  const [secret, setSecret] = useState(null);
  const apiClient = useAPIClient();
  const form = useForm();

  useEffect(() => {
    apiClient.resource('mfa').generateSecret().then(({ data }) => {
      setSecret(data.data);
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (values) => {
    await apiClient.resource('mfa').enable({ ...values, secret: secret.secret });
    // TODO: show success message and close modal
  };

  if (loading) {
    return <Spin />;
  }

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
    <div>
      <Alert
        message="Scan the QR code with your authenticator app"
        description="If you can't scan the QR code, you can manually enter the secret key."
        type="info"
        showIcon
      />
      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        <img src={secret.dataURL} alt="QR Code" />
      </div>
      <Paragraph copyable={{ text: secret.secret }}>
        Secret Key: {secret.secret}
      </Paragraph>
      <Form form={form} onFinish={handleSubmit}>
        <SchemaComponent schema={schema} />
        <Button block type="primary" htmlType="submit">
          Verify and Enable
        </Button>
      </Form>
    </div>
  );
};
