import { Plugin } from '@nocobase/server';
import { PluginEmailManagerClient } from './client';
import { PluginEmailManagerServer } from './server';

export class PluginEmailManager extends Plugin {
  async load() {
    // @ts-ignore
    await this.app.plugin(PluginEmailManagerServer, this.options);
    // @ts-ignore
    await this.app.plugin(PluginEmailManagerClient, this.options);
  }
}

export default PluginEmailManager;
