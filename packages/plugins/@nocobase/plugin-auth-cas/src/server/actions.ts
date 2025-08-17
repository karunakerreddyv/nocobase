import { Context, Next } from '@nocobase/actions';
import passport from '@koa/passport';
import { Strategy as CasStrategy } from '@rula/passport-cas';

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

function getCasStrategy(options) {
  return new CasStrategy(options, (profile, done) => {
    done(null, profile);
  });
}

export async function redirectToProvider(ctx: Context, next: Next) {
  const authenticator = await getAuthenticator(ctx);
  const { casUrl, serviceUrl, ...otherOptions } = authenticator.options;

  const passportInstance = new passport.Passport();
  const strategy = getCasStrategy({
    casUrl,
    serviceUrl,
    ...otherOptions,
  });
  passportInstance.use(strategy);

  const middleware = passportInstance.authenticate('cas', { session: false });
  return middleware(ctx, next);
}

export async function handleCallback(ctx: Context, next: Next) {
  const authenticator = await getAuthenticator(ctx);
  const { casUrl, serviceUrl, ...otherOptions } = authenticator.options;

  const passportInstance = new passport.Passport();
  const strategy = getCasStrategy({
    casUrl,
    serviceUrl,
    ...otherOptions,
  });
  passportInstance.use(strategy);

  const middleware = passportInstance.authenticate('cas', { session: false });

  await middleware(ctx, async () => {
    const profile = ctx.state.user;
    if (!profile) {
      return ctx.throw(401, 'Authentication failed');
    }

    ctx.action.params.values = {
      ...ctx.action.params.values,
      profile,
    };

    const auth = await ctx.app.authManager.get('cas', ctx);
    const { user, token } = await auth.signIn();

    ctx.body = { user: user.toJSON(), token };
  });

  await next();
}
