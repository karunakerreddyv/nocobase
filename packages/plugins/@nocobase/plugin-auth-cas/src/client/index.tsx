import { Plugin } from '@nocobase/client';
import { authType } from '../constants';
import { Options } from './Options';
import { SigninPage } from './SigninPage';
import { CopyrightOutlined } from '@ant-design/icons';

export class PluginAuthCasClient extends Plugin {
  async load() {
    this.app.authManager.addAuthType(authType, {
      label: 'CAS',
      icon: CopyrightOutlined,
      signinPage: SigninPage,
      options: Options,
    });
  }
}

export default PluginAuthCasClient;
