import { Plugin } from '@nocobase/server';
import { Database } from '@nocobase/database';
import { OracleDataSource } from './data-sources/oracle';
import { OracleDialect } from './dialects/oracle-dialect';

export class PluginDataSourceOracleServer extends Plugin {
  async afterLoad() {
    this.app.dataSourceManager.registerDataSourceType('oracle', OracleDataSource);
    Database.registerDialect(OracleDialect);
  }

  async load() {
    // TODO: implement Oracle-specific logic
  }
}

export default PluginDataSourceOracleServer;
