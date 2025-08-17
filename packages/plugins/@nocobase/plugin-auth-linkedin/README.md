# NocoBase LinkedIn Authentication Plugin

This plugin allows users to sign in to NocoBase using their LinkedIn account.

## Configuration

1.  **Create a LinkedIn App**
    *   Go to the [LinkedIn Developer Portal](https://www.linkedin.com/developers/apps).
    *   Create a new app.
    *   Go to the "Auth" tab.
    *   Add an authorized redirect URL. This will be displayed in the NocoBase admin settings for the LinkedIn authenticator. It will look like `https://your-nocobase-app.com/api/auth/linkedin:handleCallback?authenticator=<authenticator-name>`.
    *   You will find your "Client ID" and "Client Secret" on the "Auth" tab.

2.  **Configure the LinkedIn Authenticator in NocoBase**
    *   Go to "Authentication" in the NocoBase admin settings.
    *   Add a new "LinkedIn" authenticator.
    *   Enter the "Client ID" and "Client Secret" you got from LinkedIn.
    *   Enable the authenticator.

Users will now see a "Sign in with LinkedIn" button on the sign-in page.
