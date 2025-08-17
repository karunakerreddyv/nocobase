import { Plugin } from '@nocobase/server';

import { Database } from '@nocobase/database';

//import { DataSourceManager } from '@nocobase/data-source-manager';

import { MySqlDataSource } from './data-sources/mysql';
import { MySqlDialect } from './dialects/mysql-dialect';

export class PluginDataSourceMySqlServer extends Plugin {
  async afterLoad() {

    this.app.dataSourceManager.registerDataSourceType('mysql', MySqlDataSource);
    Database.registerDialect(MySqlDialect);
/*
    const dataSourceManager = this.app.getPlugin<DataSourceManager>('data-source-manager');
    if (dataSourceManager) {
      dataSourceManager.addDataSourceType('mysql', MySqlDataSource);
    }
    this.app.db.registerDialect(MySqlDialect);
*/
  }

  async load() {
    // TODO: implement MySQL-specific logic
  }
}

export default PluginDataSourceMySqlServer;
