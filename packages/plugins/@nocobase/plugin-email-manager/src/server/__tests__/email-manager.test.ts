import { Application } from '@nocobase/server';
import { PluginEmailManagerServer } from '../server';
import nodemailer from 'nodemailer';
import { vi } from 'vitest';

vi.mock('nodemailer');

describe('email-manager', () => {
  let app: Application;

  beforeEach(async () => {
    app = new Application({
      database: {
        dialect: 'sqlite',
        storage: ':memory:',
      },
      plugins: [[PluginEmailManagerServer, { name: 'email-manager' }]],
    });
    await app.load();
    await app.db.sync();
  });

  afterEach(async () => {
    await app.db.close();
    await app.destroy();
  });

  it('should be loaded', async () => {
    const pm = app.getPlugin('email-manager') as PluginEmailManagerServer;
    expect(pm).toBeInstanceOf(PluginEmailManagerServer);
  });

  it('should have transports and email_logs collections', async () => {
    const transports = app.db.getCollection('transports');
    const emailLogs = app.db.getCollection('email_logs');
    expect(transports).toBeDefined();
    expect(emailLogs).toBeDefined();
  });

  it('should send email', async () => {
    const pm = app.getPlugin('email-manager') as PluginEmailManagerServer;
    const transport = {
      name: 'default',
      type: 'smtp',
      config: {
        host: 'localhost',
        port: 25,
        auth: {
          user: 'test',
          pass: 'test',
        },
      },
      default: true,
    };
    await app.db.getRepository('transports').create({ values: transport });
    await pm.loadTransports();

    const sendMail = vi.fn();
    (nodemailer.createTransport as any).mockReturnValue({ sendMail });

    await pm.send({
      to: 'test@example.com',
      subject: 'test',
      html: 'test',
    });

    expect(sendMail).toBeCalledTimes(1);
    expect(sendMail).toBeCalledWith({
      from: 'test',
      to: 'test@example.com',
      subject: 'test',
      html: 'test',
    });
  });
});
