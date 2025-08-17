import { BaseAuth } from '@nocobase/auth';
import { Model } from '@nocobase/database';
import { AuthModel } from '@nocobase/plugin-auth';

export class TwitterAuth extends BaseAuth {
  async validate(): Promise<Model> {
    const { profile } = this.ctx.action.params.values;
    if (!profile) {
      throw new Error('Twitter profile not found');
    }

    const twitterUserId = profile.id;
    const email = profile.emails?.[0]?.value;

    if (!twitterUserId) {
      throw new Error('Twitter profile must have an id');
    }

    if (!email) {
      throw new Error('Twitter profile must have an email. Please check your Twitter account settings.');
    }

    const authenticator = this.authenticator as AuthModel;

    // 1. Find user by twitter user id
    let user = await authenticator.findUser(twitterUserId);
    if (user) {
      return user;
    }

    // 2. Find user by email
    user = await this.userRepository.findOne({
      filter: { email },
    });

    if (user) {
      // Link user to authenticator
      await authenticator.addUser(user, { through: { uuid: twitterUserId } });
      return user;
    }

    // 3. Create new user if auto-signup is enabled
    const { autoSignup } = authenticator.options?.public || {};
    if (autoSignup) {
      const newUser = await authenticator.newUser(twitterUserId, {
        email,
        nickname: profile.displayName,
        // you can add more fields from the profile here
      });
      return newUser;
    }

    // 4. If nothing works, return null
    return null;
  }
}
