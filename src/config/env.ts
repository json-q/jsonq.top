import * as dotenv from 'dotenv';

const env = process.env.NODE_ENV || 'development';

// dotenv.config({ path: `.env.${env}` });
// all config in production
dotenv.config({ path: `.env.production` });

export default () => ({
  environment: env,
  oss: {
    accessKeyId: process.env.AccessKeyID,
    accessKeySecret: process.env.AccessKeySecret,
    bucket: process.env.Bucket,
    region: process.env.Region,
    endpoint: process.env.Endpoint,
  },
  cookie: {
    userKey: process.env.CookieUserKey,
    accessKey: process.env.CookieAccessKey,
    refreshKey: process.env.CookieRefreshKey,
  },
  throttler: {
    ttl: process.env.ThrottleTTL,
    limit: env === 'development' ? 1000 : process.env.ThrottleLimit,
  },
  github: {
    userId: process.env.GithubID,
    clientID: process.env.ClientID,
    clientSecret: process.env.ClientSecret,
    callbackURL: process.env.CallbackURL,
  },
});
