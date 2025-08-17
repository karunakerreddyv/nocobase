import { Plugin } from '@nocobase/client';
import { Modal } from 'antd';
import React from 'react';
import { VerifyMfa } from './VerifyMfa';

export class PluginMfaClient extends Plugin {
  async load() {
    this.app.apiClient.axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.data?.code === 'MFA_REQUIRED') {
          const { userId } = error.response.data.data;
          const modal = Modal.info({
            title: 'Two-Factor Authentication Required',
            content: <VerifyMfa userId={userId} />,
            okButtonProps: { style: { display: 'none' } },
          });
          // TODO: how to close the modal after successful verification?
        }
        return Promise.reject(error);
      },
    );
  }
}

export default PluginMfaClient;
