# NocoBase Google Authentication Plugin

This plugin allows users to sign in to NocoBase using their Google account.

## Configuration

1.  **Create a Google OAuth 2.0 Client ID**
    *   Go to the [Google API Console](https://console.developers.google.com/).
    *   Create a new project.
    *   Go to "Credentials" and click "Create credentials" > "OAuth client ID".
    *   Select "Web application" as the application type.
    *   Add an authorized redirect URI. This will be displayed in the NocoBase admin settings for the Google authenticator. It will look like `https://your-nocobase-app.com/api/auth/google:handleCallback?authenticator=<authenticator-name>`.
    *   Copy the "Client ID" and "Client secret".

2.  **Configure the Google Authenticator in NocoBase**
    *   Go to "Authentication" in the NocoBase admin settings.
    *   Add a new "Google" authenticator.
    *   Enter the "Client ID" and "Client secret" you got from Google.
    *   Enable the authenticator.

Users will now see a "Sign in with Google" button on the sign-in page.
