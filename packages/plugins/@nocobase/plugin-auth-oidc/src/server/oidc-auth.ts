import { BaseAuth } from '@nocobase/auth';
import { Model } from '@nocobase/database';
import { AuthModel } from '@nocobase/plugin-auth';

export class OidcAuth extends BaseAuth {
  async validate(): Promise<Model> {
    const { profile } = this.ctx.action.params.values;
    if (!profile) {
      throw new Error('OIDC profile not found');
    }

    const oidcUserId = profile.id || profile._json.sub;
    const email = profile.emails?.[0]?.value || profile._json.email;

    if (!oidcUserId || !email) {
      throw new Error('OIDC profile must have id and email');
    }

    const authenticator = this.authenticator as AuthModel;

    // 1. Find user by oidc user id
    let user = await authenticator.findUser(oidcUserId);
    if (user) {
      return user;
    }

    // 2. Find user by email
    user = await this.userRepository.findOne({
      filter: { email },
    });

    if (user) {
      // Link user to authenticator
      await authenticator.addUser(user, { through: { uuid: oidcUserId } });
      return user;
    }

    // 3. Create new user if auto-signup is enabled
    const { autoSignup } = authenticator.options?.public || {};
    if (autoSignup) {
      const newUser = await authenticator.newUser(oidcUserId, {
        email,
        nickname: profile.displayName || profile._json.name,
        // you can add more fields from the profile here
      });
      return newUser;
    }

    // 4. If nothing works, return null
    return null;
  }
}
