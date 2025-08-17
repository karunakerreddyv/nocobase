import { Plugin } from '@nocobase/client';
import { authType } from '../constants';
import { Options } from './Options';
import { SigninPage } from './SigninPage';
import { LinkedinOutlined } from '@ant-design/icons';

export class PluginAuthLinkedInClient extends Plugin {
  async load() {
    this.app.authManager.addAuthType(authType, {
      label: 'LinkedIn',
      icon: LinkedinOutlined,
      signinPage: SigninPage,
      options: Options,
    });
  }
}

export default PluginAuthLinkedInClient;
