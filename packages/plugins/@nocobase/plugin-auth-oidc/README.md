# NocoBase OIDC Authentication Plugin

This plugin allows users to sign in to NocoBase using any OpenID Connect (OIDC) compliant identity provider.

## Configuration

1.  **Configure your OIDC Provider**
    *   You will need to get the following information from your OIDC provider:
        *   Issuer URL
        *   Authorization URL
        *   Token URL
        *   Client ID
        *   Client Secret
    *   You will also need to configure a redirect URI in your OIDC provider. This will be displayed in the NocoBase admin settings for the OIDC authenticator. It will look like `https://your-nocobase-app.com/api/auth/oidc:handleCallback?authenticator=<authenticator-name>`.

2.  **Configure the OIDC Authenticator in NocoBase**
    *   Go to "Authentication" in the NocoBase admin settings.
    *   Add a new "OIDC" authenticator.
    *   Fill in the configuration fields with the information you got from your OIDC provider.
    *   Enable the authenticator.

Users will now see a "Sign in with OIDC" button on the sign-in page. This can be renamed in the authenticator settings.
