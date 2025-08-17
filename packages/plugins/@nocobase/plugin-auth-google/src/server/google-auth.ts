import { AuthConfig, BaseAuth } from '@nocobase/auth';
import { Model } from '@nocobase/database';
import { AuthModel } from '@nocobase/plugin-auth';

export class GoogleAuth extends BaseAuth {
  constructor(config: AuthConfig) {
    super({
      ...config,
      userCollection: config.ctx.db.getCollection('users'),
    });
  }

  async validate(): Promise<Model> {
    const { profile } = this.ctx.action.params.values;
    if (!profile) {
      throw new Error('Google profile not found');
    }

    const googleUserId = profile.id;
    const email = profile.emails?.[0]?.value;

    if (!googleUserId || !email) {
      throw new Error('Google profile must have id and email');
    }

    const authenticator = this.authenticator as AuthModel;

    // 1. Find user by google user id
    let user = await authenticator.findUser(googleUserId);
    if (user) {
      return user;
    }

    // 2. Find user by email
    user = await this.userRepository.findOne({
      filter: { email },
    });

    if (user) {
      // Link user to authenticator
      await authenticator.addUser(user, { through: { uuid: googleUserId } });
      return user;
    }

    // 3. Create new user if auto-signup is enabled
    const { autoSignup } = authenticator.options?.public || {};
    if (autoSignup) {
      const newUser = await authenticator.newUser(googleUserId, {
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
