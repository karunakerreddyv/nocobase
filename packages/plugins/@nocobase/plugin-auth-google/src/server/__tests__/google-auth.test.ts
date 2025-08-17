import { MockServer } from '@nocobase/test';
import { GoogleAuth } from '../google-auth';
import { vi } from 'vitest';
import PluginUsers from '../../../../plugin-users/src/server';
import PluginAuth from '../../../../plugin-auth/src/server';
import PluginAuthGoogle from '../plugin';

describe('GoogleAuth', () => {
  let app: MockServer;
  let googleAuth: GoogleAuth;

  beforeEach(async () => {
    app = new MockServer({
      instanceId: 'test',
      plugins: [PluginUsers, PluginAuth, PluginAuthGoogle],
    });
    await app.load();

    const authenticator = {
      options: {
        public: {
          autoSignup: true,
        },
      },
      findUser: vi.fn(),
      addUser: vi.fn(),
      newUser: vi.fn().mockImplementation((id, values) => ({ id: 1, ...values })),
    };

    const ctx = {
      action: {
        params: {
          values: {
            profile: {
              id: 'google-user-123',
              displayName: 'Test User',
              emails: [{ value: 'test@example.com' }],
            },
          },
        },
      },
      app,
      db: app.db,
      authenticator,
    };

    googleAuth = new GoogleAuth({
      ctx: ctx as any,
      authenticator: authenticator as any,
      options: authenticator.options,
    });
  });

  afterEach(async () => {
    if (app) {
      await app.destroy();
    }
  });

  it('should create a new user if auto-signup is enabled', async () => {
    const user = await googleAuth.validate();
    expect(user).toBeDefined();
    expect(user.id).toBe(1);
    expect(user.email).toBe('test@example.com');
    expect(googleAuth.authenticator.newUser).toHaveBeenCalledWith('google-user-123', {
      email: 'test@example.com',
      nickname: 'Test User',
    });
  });
});
