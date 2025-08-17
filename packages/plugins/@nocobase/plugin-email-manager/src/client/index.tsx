import { Plugin } from '@nocobase/client';
import { EmailManagerProvider } from './EmailManagerProvider';

const NAMESPACE = 'email-manager';

export class PluginEmailManagerClient extends Plugin {
  async load() {
    this.app.pluginSettingsManager.add(NAMESPACE, {
      title: 'Email Manager',
      icon: 'MailOutlined',
      Component: EmailManagerProvider,
      aclSnippet: 'pm.email-manager.transports',
      category: 'systemSettings',
      order: 4,
    });
  }
}

export default PluginEmailManagerClient;
