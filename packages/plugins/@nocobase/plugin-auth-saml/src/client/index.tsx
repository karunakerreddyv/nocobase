import { Plugin } from '@nocobase/client';
import { authType } from '../constants';
import { Options } from './Options';
import { SigninPage } from './SigninPage';
import { LockOutlined } from '@ant-design/icons';

export class PluginAuthSamlClient extends Plugin {
  async load() {
    this.app.authManager.addAuthType(authType, {
      label: 'SAML',
      icon: LockOutlined,
      signinPage: SigninPage,
      options: Options,
    });
  }
}

export default PluginAuthSamlClient;
