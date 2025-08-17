import { InstallOptions, Plugin } from '@nocobase/server';
import { DataSourceManager } from '@nocobase/data-source-manager';
import { RestApiDataSource } from './data-source';

export class PluginDataSourceRestApi extends Plugin {
  afterAdd() {
    //
  }

  beforeLoad() {
    //
  }

  async load() {
    const dataSourceManager = this.app.getPlugin<DataSourceManager>('data-source-manager');
    if (dataSourceManager) {
      dataSourceManager.addDataSourceType('rest-api', RestApiDataSource);
    }
  }

  async install(options?: InstallOptions) {
    //
  }

  async afterEnable() {
    //
  }

  async afterDisable() {
    //
  }

  async remove() {
    //
  }
}

export default PluginDataSourceRestApi;
