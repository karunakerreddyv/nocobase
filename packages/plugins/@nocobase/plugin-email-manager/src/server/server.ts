import { Plugin } from '@nocobase/server';
import * as nodemailer from 'nodemailer';
import {
  createTransport,
  destroyTransport,
  getTransport,
  listTransports,
  send,
  updateTransport,
  testTransport,
} from './actions';
import { ConfidentialClientApplication } from '@azure/msal-node';
import { Client } from '@microsoft/microsoft-graph-client';

export class PluginEmailManagerServer extends Plugin {
  transports = new Map<string, any>();

  async load() {
    this.db.collection({
      name: 'transports',
      fields: [
        { type: 'string', name: 'name', unique: true, required: true },
        { type: 'string', name: 'type', defaultValue: 'smtp' },
        { type: 'json', name: 'config', required: true },
        { type: 'boolean', name: 'default', defaultValue: false },
      ],
    });

    this.db.collection({
      name: 'email_logs',
      fields: [
        { type: 'string', name: 'from' },
        { type: 'string', name: 'to' },
        { type: 'string', name: 'subject' },
        { type: 'text', name: 'html' },
        { type: 'string', name: 'status' }, // sent, failed
        { type: 'text', name: 'error' },
        { type: 'belongsTo', name: 'transport' },
      ],
    });

    this.app.on('afterStart', async () => {
      await this.loadTransports();
    });

    this.app.resourcer.registerAction('email:send', send);
    this.app.resourcer.registerAction('transports:list', listTransports);
    this.app.resourcer.registerAction('transports:get', getTransport);
    this.app.resourcer.registerAction('transports:create', createTransport);
    this.app.resourcer.registerAction('transports:update', updateTransport);
    this.app.resourcer.registerAction('transports:destroy', destroyTransport);
    this.app.resourcer.registerAction('transports:test', testTransport);

    this.app.acl.allow('email', 'send', 'loggedIn');
    this.app.acl.allow('transports', ['list', 'get', 'create', 'update', 'destroy', 'test'], 'loggedIn');
  }

  async loadTransports() {
    const repository = this.db.getRepository('transports');
    const transports = await repository.find();
    this.transports.clear();
    for (const transport of transports) {
      this.transports.set(transport.get('name'), transport.get('config'));
    }
  }

  async send(options: { to: string; subject: string; html: string; transportName?: string }) {
    const { to, subject, html, transportName } = options;
    let transportConfig;
    let transport;

    const repository = this.db.getRepository('transports');

    if (transportName) {
      transport = await repository.findOne({ filter: { name: transportName } });
    } else {
      transport = await repository.findOne({ filter: { default: true } });
    }

    if (!transport) {
      throw new Error('No default email transport configured');
    }

    transportConfig = transport.get('config');

    if (transport.get('type') === 'microsoft') {
      const { clientId, clientSecret, tenantId } = transportConfig;
      const msalConfig = {
        auth: {
          clientId,
          authority: `https://login.microsoftonline.com/${tenantId}`,
          clientSecret,
        },
      };
      const cca = new ConfidentialClientApplication(msalConfig);
      const authResult = await cca.acquireTokenByClientCredential({
        scopes: ['https://graph.microsoft.com/.default'],
      });

      const client = Client.init({
        authProvider: (done) => {
          done(null, authResult.accessToken);
        },
      });

      const message = {
        subject,
        toRecipients: [{ emailAddress: { address: to } }],
        body: {
          content: html,
          contentType: 'html',
        },
      };

      try {
        const response = await client.api('/me/sendMail').post({ message });
        const log = {
          from: transportConfig.auth.user,
          to,
          subject,
          html,
          status: 'sent',
          transportId: transport.get('id'),
        };
        await this.db.getRepository('email_logs').create({ values: log });
        return response;
      } catch (error) {
        const log = {
          from: transportConfig.auth.user,
          to,
          subject,
          html,
          status: 'failed',
          error: error.message,
          transportId: transport.get('id'),
        };
        await this.db.getRepository('email_logs').create({ values: log });
        throw error;
      }
    } else {
      const transporter = nodemailer.createTransport(transportConfig);

      try {
        const info = await transporter.sendMail({
          from: transportConfig.auth.user,
          to,
          subject,
          html,
        });

        const log = {
          from: transportConfig.auth.user,
          to,
          subject,
          html,
          status: 'sent',
          transportId: transport.get('id'),
        };
        await this.db.getRepository('email_logs').create({ values: log });

        return info;
      } catch (error) {
        const log = {
          from: transportConfig.auth.user,
          to,
          subject,
          html,
          status: 'failed',
          error: error.message,
          transportId: transport.get('id'),
        };
        await this.db.getRepository('email_logs').create({ values: log });
        throw error;
      }
    }
  }
}

export default PluginEmailManagerServer;
