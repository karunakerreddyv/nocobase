# NocoBase CAS Authentication Plugin

This plugin allows users to sign in to NocoBase using a Central Authentication Service (CAS) server.

## Configuration

1.  **Configure your CAS Server**
    *   You will need to register your NocoBase application as a service with your CAS server.
    *   The service URL (callback URL) will be displayed in the NocoBase CAS authenticator settings. It will look like `https://your-nocobase-app.com/api/auth/cas:handleCallback?authenticator=<authenticator-name>`.

2.  **Configure the CAS Authenticator in NocoBase**
    *   Go to "Authentication" in the NocoBase admin settings.
    *   Add a new "CAS" authenticator.
    *   Fill in the **CAS Server URL**. This is the base URL of your CAS server (e.g., `https://cas.example.com/cas`).
    *   Enable the authenticator.

Users will now see a "Sign in with CAS" button on the sign-in page.
