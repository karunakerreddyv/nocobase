import { BaseAuth } from '@nocobase/auth';
import { Model } from '@nocobase/database';
import { AuthModel } from '@nocobase/plugin-auth';

export class CasAuth extends BaseAuth {
  async validate(): Promise<Model> {
    const { profile } = this.ctx.action.params.values;
    if (!profile) {
      throw new Error('CAS profile not found');
    }

    const casUserId = profile.user;
    const email = profile.attributes?.mail;

    if (!casUserId || !email) {
      throw new Error('CAS profile must have user and email');
    }

    const authenticator = this.authenticator as AuthModel;

    // 1. Find user by cas user id
    let user = await authenticator.findUser(casUserId);
    if (user) {
      return user;
    }

    // 2. Find user by email
    user = await this.userRepository.findOne({
      filter: { email },
    });

    if (user) {
      // Link user to authenticator
      await authenticator.addUser(user, { through: { uuid: casUserId } });
      return user;
    }

    // 3. Create new user if auto-signup is enabled
    const { autoSignup } = authenticator.options?.public || {};
    if (autoSignup) {
      const newUser = await authenticator.newUser(casUserId, {
        email,
        nickname: profile.attributes?.displayName || casUserId,
        // you can add more fields from the profile here
      });
      return newUser;
    }

    // 4. If nothing works, return null
    return null;
  }
}
