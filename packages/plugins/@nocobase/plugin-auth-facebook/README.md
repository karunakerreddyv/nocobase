# NocoBase Facebook Authentication Plugin

This plugin allows users to sign in to NocoBase using their Facebook account.

## Configuration

1.  **Create a Facebook App**
    *   Go to [Facebook for Developers](https://developers.facebook.com/apps/).
    *   Create a new app.
    *   Go to "Facebook Login" > "Settings".
    *   Add a valid OAuth redirect URI. This will be displayed in the NocoBase admin settings for the Facebook authenticator. It will look like `https://your-nocobase-app.com/api/auth/facebook:handleCallback?authenticator=<authenticator-name>`.
    *   Go to "Settings" > "Basic" to get your "App ID" and "App secret".

2.  **Configure the Facebook Authenticator in NocoBase**
    *   Go to "Authentication" in the NocoBase admin settings.
    *   Add a new "Facebook" authenticator.
    *   Enter the "App ID" and "App secret" you got from Facebook.
    *   Enable the authenticator.

Users will now see a "Sign in with Facebook" button on the sign-in page.
