import { Verification } from '@nocobase/plugin-verification';
import { authenticator } from 'otplib';
import qrcode from 'qrcode';

export class TotpVerification extends Verification {
  async generate(payload: { userId: number, email: string }) {
    const secret = authenticator.generateSecret();
    const otpauth = authenticator.keyuri(payload.email, 'NocoBase', secret);

    const dataURL = await qrcode.toDataURL(otpauth);

    return {
      secret,
      dataURL,
    };
  }

  verifyCodeWithSecret(code: string, secret: string): boolean {
    return authenticator.verify({ token: code, secret });
  }

  async verify(payload: { userId: number, code: string }): Promise<boolean> {
    const userVerifier = await this.ctx.db.getRepository('usersVerifiers').findOne({
        filter: {
            userId: payload.userId,
            verifier: {
                verificationType: 'totp',
            },
        },
    });

    if (!userVerifier) {
        return false;
    }

    const { secret } = userVerifier.settings;
    return this.verifyCodeWithSecret(payload.code, secret);
  }
}
