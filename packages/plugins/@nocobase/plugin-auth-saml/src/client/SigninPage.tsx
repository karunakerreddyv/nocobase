import React from 'react';
import { Button } from 'antd';

export const SigninPage = (props) => {
  const { authenticator } = props;

  const handleSignin = () => {
    window.location.href = `/api/auth/saml:redirectToProvider?authenticator=${authenticator.name}`;
  };

  return (
    <Button block onClick={handleSignin}>
      Sign in with SAML
    </Button>
  );
};
