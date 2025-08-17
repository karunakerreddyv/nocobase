import { Context, Next } from '@nocobase/actions';
import passport from '@koa/passport';
import { Strategy as OIDCStrategy } from 'passport-openidconnect';

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
  const { issuer, authorizationURL, tokenURL, clientID, clientSecret, callbackURL, scope, userInfoURL } = authenticator.options;

  const passportInstance = new passport.Passport();
  passportInstance.use(new OIDCStrategy({
    issuer,
    authorizationURL,
    tokenURL,
    clientID,
    clientSecret,
    callbackURL,
    scope,
    userInfoURL,
  }, (issuer, profile, done) => {
    done(null, profile);
  }));

  const middleware = passportInstance.authenticate('openidconnect', { scope: scope || 'openid profile email', session: false });
  return middleware(ctx, next);
}

export async function handleCallback(ctx: Context, next: Next) {
  const authenticator = await getAuthenticator(ctx);
  const { issuer, authorizationURL, tokenURL, clientID, clientSecret, callbackURL, scope, userInfoURL } = authenticator.options;

  const passportInstance = new passport.Passport();
  passportInstance.use(new OIDCStrategy({
    issuer,
    authorizationURL,
    tokenURL,
    clientID,
    clientSecret,
    callbackURL,
    scope,
    userInfoURL,
  }, (issuer, profile, done) => {
    done(null, profile);
  }));

  const middleware = passportInstance.authenticate('openidconnect', { session: false });

  await middleware(ctx, async () => {
    const profile = ctx.state.user;
    if (!profile) {
      return ctx.throw(401, 'Authentication failed');
    }

    ctx.action.params.values = {
      ...ctx.action.params.values,
      profile,
    };

    const auth = await ctx.app.authManager.get('oidc', ctx);
    const { user, token } = await auth.signIn();

    ctx.body = { user: user.toJSON(), token };
  });

  await next();
}
