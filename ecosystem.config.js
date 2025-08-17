module.exports = {
  apps: [
    {
      name: 'nocobase',
      script: './node_modules/.bin/nocobase',
      args: 'start',
      watch: false,
    },
  ],
};
