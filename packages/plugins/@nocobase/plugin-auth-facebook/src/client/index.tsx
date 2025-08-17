import { Plugin } from '@nocobase/client';
import { authType } from '../constants';
import { Options } from './Options';
import { SigninPage } from './SigninPage';
import { FacebookOutlined } from '@ant-design/icons';

export class PluginAuthFacebookClient extends Plugin {
  async load() {
    this.app.authManager.addAuthType(authType, {
      label: 'Facebook',
      icon: FacebookOutlined,
      signinPage: SigninPage,
      options: Options,
    });
  }
}

export default PluginAuthFacebookClient;
