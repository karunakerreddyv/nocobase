import { BaseAuth } from '@nocobase/auth';
import { Model } from '@nocobase/database';
import { AuthModel } from '@nocobase/plugin-auth';

export class SamlAuth extends BaseAuth {
  async validate(): Promise<Model> {
    const { profile } = this.ctx.action.params.values;
    if (!profile) {
      throw new Error('SAML profile not found');
    }

    const samlUserId = profile.nameID;
    const email = profile.email;

    if (!samlUserId || !email) {
      throw new Error('SAML profile must have nameID and email');
    }

    const authenticator = this.authenticator as AuthModel;

    // 1. Find user by saml user id
    let user = await authenticator.findUser(samlUserId);
    if (user) {
      return user;
    }

    // 2. Find user by email
    user = await this.userRepository.findOne({
      filter: { email },
    });

    if (user) {
      // Link user to authenticator
      await authenticator.addUser(user, { through: { uuid: samlUserId } });
      return user;
    }

    // 3. Create new user if auto-signup is enabled
    const { autoSignup } = authenticator.options?.public || {};
    if (autoSignup) {
      const newUser = await authenticator.newUser(samlUserId, {
        email,
        nickname: profile.displayName || email.split('@')[0],
        // you can add more fields from the profile here
      });
      return newUser;
    }

    // 4. If nothing works, return null
    return null;
  }
}
