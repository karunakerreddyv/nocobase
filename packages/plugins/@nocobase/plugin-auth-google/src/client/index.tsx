import { Plugin } from '@nocobase/client';
import { authType } from '../constants';
import { Options } from './Options';
import { SigninPage } from './SigninPage';
import { GoogleOutlined } from '@ant-design/icons';

export class PluginAuthGoogleClient extends Plugin {
  async load() {
    this.app.authManager.addAuthType(authType, {
      label: 'Google',
      icon: GoogleOutlined,
      signinPage: SigninPage,
      options: Options,
    });
  }
}

export default PluginAuthGoogleClient;
