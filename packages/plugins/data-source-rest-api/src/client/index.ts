import { Plugin } from '@nocobase/client';
import { PluginDataSourceManagerClient } from '@nocobase/plugin-data-source-manager/client';
import { restApiFormSchema } from './form-schema';

export class PluginDataSourceRestApiClient extends Plugin {
  async load() {
    const dsManager = this.app.getPlugin<PluginDataSourceManagerClient>('data-source-manager');
    dsManager.registerType('rest-api', {
      title: 'REST API',
      schema: restApiFormSchema,
    });
  }
}

export default PluginDataSourceRestApiClient;
