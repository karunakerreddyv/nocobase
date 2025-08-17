import { Plugin } from '@nocobase/client';
import { authType } from '../constants';
import { Options } from './Options';
import { SigninForm } from './SigninForm';
import { IdcardOutlined } from '@ant-design/icons';

export class PluginAuthLdapClient extends Plugin {
  async load() {
    this.app.authManager.addAuthType(authType, {
      label: 'LDAP',
      icon: IdcardOutlined,
      signinPage: SigninForm,
      options: Options,
    });
  }
}

export default PluginAuthLdapClient;
