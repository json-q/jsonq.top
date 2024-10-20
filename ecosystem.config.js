// pm2 config file
module.exports = {
  apps: [
    {
      script: 'dist/src/main.js',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
