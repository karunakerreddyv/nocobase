# NocoBase Twitter Authentication Plugin

This plugin allows users to sign in to NocoBase using their Twitter account.

## Configuration

1.  **Create a Twitter App**
    *   Go to the [Twitter Developer Portal](https://developer.twitter.com/en/portal/projects-and-apps).
    *   Create a new app.
    *   Enable 3-legged OAuth.
    *   Add a callback URI. This will be displayed in the NocoBase admin settings for the Twitter authenticator. It will look like `https://your-nocobase-app.com/api/auth/twitter:handleCallback?authenticator=<authenticator-name>`.
    *   You will need to get your "API Key" (Consumer Key) and "API Key Secret" (Consumer Secret).

2.  **Configure the Twitter Authenticator in NocoBase**
    *   Go to "Authentication" in the NocoBase admin settings.
    *   Add a new "Twitter" authenticator.
    *   Enter the "API Key" and "API Key Secret".
    *   Enable the authenticator.

Users will now see a "Sign in with Twitter" button on the sign-in page.
