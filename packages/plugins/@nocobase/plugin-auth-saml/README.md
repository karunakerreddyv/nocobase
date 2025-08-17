# NocoBase SAML Authentication Plugin

This plugin allows users to sign in to NocoBase using any SAML 2.0 compliant identity provider (IdP).

## Configuration

1.  **Configure your SAML IdP**
    *   You will need to provide your IdP with the "Callback URL" (also known as the Assertion Consumer Service or ACS URL) from the NocoBase SAML authenticator settings. It will look like `https://your-nocobase-app.com/api/auth/saml:handleCallback?authenticator=<authenticator-name>`.
    *   You will also need to provide the "Issuer" (also known as the Service Provider Entity ID). This should be a unique identifier for your NocoBase application.
    *   Your IdP will provide you with:
        *   Identity Provider SSO URL (Entry Point)
        *   Identity Provider Certificate (in Base64 format)

2.  **Configure the SAML Authenticator in NocoBase**
    *   Go to "Authentication" in the NocoBase admin settings.
    *   Add a new "SAML" authenticator.
    *   Fill in the configuration fields with the information you got from your IdP.
    *   Enable the authenticator.

Users will now see a "Sign in with SAML" button on the sign-in page.
