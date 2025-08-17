import { BaseAuth } from '@nocobase/auth';
import { Model } from '@nocobase/database';
import { AuthModel } from '@nocobase/plugin-auth';
import LdapAuthLib from 'ldapauth-fork';

export class LdapAuth extends BaseAuth {
  async validate(): Promise<Model> {
    const { username, password } = this.ctx.action.params.values;
    if (!username || !password) {
      throw new Error('Username and password are required');
    }

    const { serverUrl, bindDN, bindCredentials, searchBase, searchFilter } = this.authenticator.options;

    const ldap = new LdapAuthLib({
      url: serverUrl,
      bindDN,
      bindCredentials,
      searchBase,
      searchFilter,
    });

    return new Promise((resolve, reject) => {
      ldap.authenticate(username, password, async (err, user) => {
        if (err) {
          return reject(err);
        }

        if (!user) {
          return reject(new Error('Authentication failed'));
        }

        const ldapUserId = user.uid || user.cn;
        const email = user.mail;

        if (!ldapUserId || !email) {
          throw new Error('LDAP profile must have uid/cn and mail');
        }

        const authenticator = this.authenticator as AuthModel;

        // 1. Find user by ldap user id
        let dbUser = await authenticator.findUser(ldapUserId);
        if (dbUser) {
          return resolve(dbUser);
        }

        // 2. Find user by email
        dbUser = await this.userRepository.findOne({
          filter: { email },
        });

        if (dbUser) {
          // Link user to authenticator
          await authenticator.addUser(dbUser, { through: { uuid: ldapUserId } });
          return resolve(dbUser);
        }

        // 3. Create new user if auto-signup is enabled
        const { autoSignup } = authenticator.options?.public || {};
        if (autoSignup) {
          const newUser = await authenticator.newUser(ldapUserId, {
            email,
            nickname: user.displayName || user.cn,
          });
          return resolve(newUser);
        }

        // 4. If nothing works, return null
        resolve(null);
      });
    });
  }
}
