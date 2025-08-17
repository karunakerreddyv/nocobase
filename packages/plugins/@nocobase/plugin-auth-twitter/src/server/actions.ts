import { Context, Next } from '@nocobase/actions';
import passport from '@koa/passport';
import { Strategy as TwitterStrategy } from 'passport-twitter';

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
  const { consumerKey, consumerSecret, callbackURL } = authenticator.options;

  const passportInstance = new passport.Passport();
  passportInstance.use(new TwitterStrategy({
    consumerKey,
    consumerSecret,
    callbackURL,
    userProfileURL: "https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true"
  }, (token, tokenSecret, profile, done) => {
    done(null, profile);
  }));

  const middleware = passportInstance.authenticate('twitter', { session: false });
  return middleware(ctx, next);
}

export async function handleCallback(ctx: Context, next: Next) {
  const authenticator = await getAuthenticator(ctx);
  const { consumerKey, consumerSecret, callbackURL } = authenticator.options;

  const passportInstance = new passport.Passport();
  passportInstance.use(new TwitterStrategy({
    consumerKey,
    consumerSecret,
    callbackURL,
    userProfileURL: "https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true"
  }, (token, tokenSecret, profile, done) => {
    done(null, profile);
  }));

  const middleware = passportInstance.authenticate('twitter', { session: false });

  await middleware(ctx, async () => {
    const profile = ctx.state.user;
    if (!profile) {
      return ctx.throw(401, 'Authentication failed');
    }

    ctx.action.params.values = {
      ...ctx.action.params.values,
      profile,
    };

    const auth = await ctx.app.authManager.get('twitter', ctx);
    const { user, token } = await auth.signIn();

    ctx.body = { user: user.toJSON(), token };
  });

  await next();
}
