import { Plugin } from '@nocobase/client';
import { authType } from '../constants';
import { Options } from './Options';
import { SigninPage } from './SigninPage';
import { IdcardOutlined } from '@ant-design/icons';

export class PluginAuthOidcClient extends Plugin {
  async load() {
    this.app.authManager.addAuthType(authType, {
      label: 'OIDC',
      icon: IdcardOutlined,
      signinPage: SigninPage,
      options: Options,
    });
  }
}

export default PluginAuthOidcClient;
