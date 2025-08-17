import { Context, Next } from '@nocobase/actions';
import { PluginEmailManagerServer } from './server';

export const send = async (ctx: Context, next: Next) => {
  const plugin = ctx.app.getPlugin('email-manager') as PluginEmailManagerServer;
  const { to, subject, html, transport: transportName } = ctx.action.params.values;

  try {
    await plugin.send({
      to,
      subject,
      html,
      transportName,
    });
    ctx.body = {
      message: 'Email sent successfully',
    };
  } catch (error) {
    ctx.throw(500, error.message);
  }

  await next();
};

export const createTransport = async (ctx: Context, next: Next) => {
  const { values } = ctx.action.params;
  const repository = ctx.db.getRepository('transports');
  const transport = await repository.create({ values });
  const plugin = ctx.app.getPlugin('email-manager') as PluginEmailManagerServer;
  await plugin.loadTransports();
  ctx.body = transport;
  await next();
};

export const getTransport = async (ctx: Context, next: Next) => {
  const { filterByTk } = ctx.action.params;
  const repository = ctx.db.getRepository('transports');
  const transport = await repository.findOne({
    filter: {
      id: filterByTk,
    },
  });
  ctx.body = transport;
  await next();
};

export const listTransports = async (ctx: Context, next: Next) => {
  const repository = ctx.db.getRepository('transports');
  const transports = await repository.find(ctx.action.params);
  ctx.body = transports;
  await next();
};

export const updateTransport = async (ctx: Context, next: Next) => {
  const { filterByTk, values } = ctx.action.params;
  const repository = ctx.db.getRepository('transports');
  const transport = await repository.findOne({
    filter: {
      id: filterByTk,
    },
  });
  await transport.update({ values });
  const plugin = ctx.app.getPlugin('email-manager') as PluginEmailManagerServer;
  await plugin.loadTransports();
  ctx.body = transport;
  await next();
};

export const destroyTransport = async (ctx: Context, next: Next) => {
  const { filterByTk } = ctx.action.params;
  const repository = ctx.db.getRepository('transports');
  const transport = await repository.findOne({
    filter: {
      id: filterByTk,
    },
  });
  await transport.destroy();
  const plugin = ctx.app.getPlugin('email-manager') as PluginEmailManagerServer;
  await plugin.loadTransports();
  ctx.status = 204;
  await next();
};

export const testTransport = async (ctx: Context, next: Next) => {
  const { filterByTk } = ctx.action.params;
  const repository = ctx.db.getRepository('transports');
  const transport = await repository.findOne({
    filter: {
      id: filterByTk,
    },
  });
  const plugin = ctx.app.getPlugin('email-manager') as PluginEmailManagerServer;
  try {
    await plugin.send({
      to: transport.get('config').auth.user,
      subject: 'NocoBase Email-manager Test',
      html: 'This is a test email from NocoBase email-manager.',
      transportName: transport.get('name'),
    });
    ctx.body = {
      message: 'Test email sent successfully',
    };
  } catch (error) {
    ctx.throw(500, error.message);
  }
  await next();
};
