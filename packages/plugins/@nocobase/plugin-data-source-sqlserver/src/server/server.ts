import { Plugin } from '@nocobase/server';
import { Database } from '@nocobase/database';
import { SqlServerDataSource } from './data-sources/sql-server';
import { SqlServerDialect } from './dialects/sql-server';

export class PluginDataSourceSqlServerServer extends Plugin {
  async afterLoad() {
    this.app.dataSourceManager.registerDataSourceType('sqlserver', SqlServerDataSource);
    Database.registerDialect(SqlServerDialect);
  }

  async load() {
    // TODO: implement SQL Server-specific logic
  }
}

export default PluginDataSourceSqlServerServer;
