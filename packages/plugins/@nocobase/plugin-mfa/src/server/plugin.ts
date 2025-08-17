/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

import { InstallOptions, Plugin } from '@nocobase/server';
import { verificationType, namespace } from '../constants';
import { TotpVerification } from './totp-verification';
import { tval } from '@nocobase/utils';
import { Context } from '@nocobase/actions';

export class PluginMfaServer extends Plugin {
  afterAdd() {}

  async load() {
    const verificationPlugin = this.app.getPlugin('verification');
    if (!verificationPlugin) {
      this.app.logger.warn('mfa: @nocobase/plugin-verification is required');
      return;
    }

    verificationPlugin.verificationManager.registerVerificationType(verificationType, {
      title: tval('Authenticator App', { ns: namespace }),
      verification: TotpVerification,
    });

    this.app.on('auth:signIn.after', this.handleAfterSignIn.bind(this));

    this.app.resourceManager.define({
      name: 'mfa',
      actions: {
        generateSecret: {
          action: 'mfa:generateSecret',
          handler: async (ctx, next) => {
            const actions = await import('./actions');
            await actions.generateSecret(ctx, next);
          },
        },
        enable: {
          action: 'mfa:enable',
          handler: async (ctx, next) => {
            const actions = await import('./actions');
            await actions.enable(ctx, next);
          },
        },
        verify: {
          action: 'mfa:verify',
          handler: async (ctx, next) => {
            const actions = await import('./actions');
            await actions.verify(ctx, next);
          },
        },
      },
    });
  }

  async handleAfterSignIn(ctx: Context) {
    const { user } = ctx.action.result;
    if (!user) {
      return;
    }

    const mfaEnabled = await this.isMfaEnabled(user.id);
    if (mfaEnabled) {
      // Throw a special error to indicate that MFA is required.
      // The client will catch this and redirect to the MFA verification page.
      ctx.throw(401, 'MFA required', {
        code: 'MFA_REQUIRED',
        data: {
          userId: user.id,
        },
      });
    }
  }

  async isMfaEnabled(userId: number): Promise<boolean> {
    const userVerifier = await this.db.getRepository('usersVerifiers').findOne({
      filter: {
        userId,
        verifier: {
          verificationType: verificationType,
        },
      },
    });
    return !!userVerifier;
  }

  async install(options?: InstallOptions) {}

  async afterEnable() {}

  async afterDisable() {}

  async remove() {}
}

export default PluginMfaServer;
