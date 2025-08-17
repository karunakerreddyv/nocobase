import React from 'react';
import { Button } from 'antd';

export const SigninPage = (props) => {
  const { authenticator } = props;

  const handleSignin = () => {
    window.location.href = `/api/auth/google:redirectToProvider?authenticator=${authenticator.name}`;
  };

  return (
    <Button block onClick={handleSignin}>
      Sign in with Google
    </Button>
  );
};
