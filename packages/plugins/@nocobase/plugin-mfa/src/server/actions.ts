import { Context, Next } from '@nocobase/actions';
import { TotpVerification } from './totp-verification';
import { verificationType } from '../constants';

export async function generateSecret(ctx: Context, next: Next) {
  const { user } = ctx.state;
  if (!user) {
    return ctx.throw(401, 'Unauthorized');
  }

  const verification = new TotpVerification({ ctx });
  const result = await verification.generate({ userId: user.id, email: user.email });

  ctx.body = result;
  await next();
}

export async function enable(ctx: Context, next: Next) {
  const { user } = ctx.state;
  if (!user) {
    return ctx.throw(401, 'Unauthorized');
  }

  const { code, secret } = ctx.action.params.values;
  if (!code || !secret) {
    return ctx.throw(400, 'Code and secret are required');
  }

  const verification = new TotpVerification({ ctx });
  const isValid = verification.verifyCodeWithSecret(code, secret);

  if (!isValid) {
    return ctx.throw(400, 'Invalid verification code');
  }

  const verifiersRepo = ctx.db.getRepository('verifiers');
  let totpVerifier = await verifiersRepo.findOne({
    filter: { verificationType },
  });
  if (!totpVerifier) {
    totpVerifier = await verifiersRepo.create({
      values: {
        name: 'totp',
        verificationType,
      },
    });
  }

  const userVerifiersRepo = ctx.db.getRepository('usersVerifiers');
  await userVerifiersRepo.create({
    values: {
      userId: user.id,
      verifierId: totpVerifier.id,
      settings: { secret },
    },
  });

  ctx.status = 200;
  await next();
}

export async function verify(ctx: Context, next: Next) {
  const { userId, code } = ctx.action.params.values;
  if (!userId || !code) {
    return ctx.throw(400, 'User ID and code are required');
  }

  const userVerifier = await ctx.db.getRepository('usersVerifiers').findOne({
    filter: {
      userId,
      verifier: {
        verificationType: verificationType,
      },
    },
  });

  if (!userVerifier) {
    return ctx.throw(400, 'MFA not enabled for this user');
  }

  const { secret } = userVerifier.settings;
  const verification = new TotpVerification({ ctx });
  const isValid = verification.verifyCodeWithSecret(code, secret);

  if (!isValid) {
    return ctx.throw(400, 'Invalid verification code');
  }

  // If verification is successful, we need to sign a new token for the user.
  // This part is tricky. I need to get the original auth provider and sign a new token.
  // For now, I'll just return a success message. The client will then need to
  // re-trigger the original sign-in request to get a new token.
  // This is not ideal.

  // A better approach would be to issue a new token here.
  // I can get the user from the database and use `ctx.app.authManager.jwt.sign`
  const user = await ctx.db.getRepository('users').findOne({ filterByTk: userId });
  const token = await ctx.app.authManager.get('basic', ctx).signNewToken(user.id);

  ctx.body = { token };

  await next();
}
