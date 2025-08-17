/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

import { InstallOptions, Plugin } from '@nocobase/server';
import { authType, namespace } from '../constants';
import { FacebookAuth } from './facebook-auth';
import { tval } from '@nocobase/utils';

export class PluginAuthFacebookServer extends Plugin {
  afterAdd() {}

  async load() {
    this.app.authManager.registerTypes(authType, {
      auth: FacebookAuth,
      title: tval('Facebook', { ns: namespace }),
    });

    const resource = this.app.resourceManager.getResource('auth');
    if (resource) {
      const actions = await import('./actions');
      resource.addAction('facebook:redirectToProvider', actions.redirectToProvider);
      resource.addAction('facebook:handleCallback', actions.handleCallback);
    }
  }

  async install(options?: InstallOptions) {}

  async afterEnable() {}

  async afterDisable() {}

  async remove() {}
}

export default PluginAuthFacebookServer;
