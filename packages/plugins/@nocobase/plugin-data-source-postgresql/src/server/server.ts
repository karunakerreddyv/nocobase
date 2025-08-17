import { Plugin } from '@nocobase/server';
import { Database } from '@nocobase/database';
import { PostgreSqlDataSource } from './data-sources/postgresql';
import { PostgreSqlDialect } from './dialects/postgresql-dialect';

export class PluginDataSourcePostgreSqlServer extends Plugin {
  async afterLoad() {
    this.app.dataSourceManager.registerDataSourceType('postgres', PostgreSqlDataSource);
    Database.registerDialect(PostgreSqlDialect);
  }

  async load() {
    // TODO: implement PostgreSQL-specific logic
  }
}

export default PluginDataSourcePostgreSqlServer;
