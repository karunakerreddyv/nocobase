import { Context, Next } from '@nocobase/actions';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

async function getAuthenticator(ctx: Context) {
  const { authenticator: authenticatorName } = ctx.action.params;
  if (!authenticatorName) {
    ctx.throw(400, 'Missing authenticator name');
  }

  const authenticator = await ctx.db.getRepository('authenticators').findOne({
    filter: { name: authenticatorName },
  });

  if (!authenticator || !authenticator.enabled) {
    ctx.throw(404, 'Authenticator not found or disabled');
  }

  return authenticator;
}

export async function redirectToProvider(ctx: Context, next: Next) {
  const authenticator = await getAuthenticator(ctx);
  const { clientID, clientSecret, callbackURL, scope } = authenticator.options;

  const passportInstance = new passport.Passport();
  passportInstance.use(new GoogleStrategy({
    clientID,
    clientSecret,
    callbackURL,
  }, (accessToken, refreshToken, profile, done) => {
    done(null, profile);
  }));

  const middleware = passportInstance.authenticate('google', { scope: scope || ['profile', 'email'], session: false });
  return middleware(ctx.req, ctx.res, next);
}

export async function handleCallback(ctx: Context, next: Next) {
  const authenticator = await getAuthenticator(ctx);
  const { clientID, clientSecret, callbackURL } = authenticator.options;

  const passportInstance = new passport.Passport();
  passportInstance.use(new GoogleStrategy({
    clientID,
    clientSecret,
    callbackURL,
  }, (accessToken, refreshToken, profile, done) => {
    done(null, profile);
  }));

  return new Promise((resolve, reject) => {
    const middleware = passportInstance.authenticate('google', { session: false }, async (err, user) => {
      if (err || !user) {
        return reject(err || new Error('Authentication failed'));
      }

      ctx.action.params.values = {
        ...ctx.action.params.values,
        profile: user,
      };

      const auth = await ctx.app.authManager.get('google', ctx);
      const { user: dbUser, token } = await auth.signIn();

      ctx.body = { user: dbUser.toJSON(), token };
      await next();
      resolve();
    });
    middleware(ctx.req, ctx.res, next);
  });
}
