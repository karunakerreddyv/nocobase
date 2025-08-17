# NocoBase Multi-Factor Authentication (MFA) Plugin

This plugin adds Multi-Factor Authentication (MFA) to NocoBase, providing an extra layer of security for user accounts.

## Features

*   **Time-based One-Time Password (TOTP):** Users can use an authenticator app (like Google Authenticator, Authy, etc.) to generate a one-time code for sign-in.
*   **Per-User Enablement:** MFA can be enabled or disabled by each user for their own account.

## How it Works

When a user enables MFA, they will be prompted to enter a code from their authenticator app after they have successfully authenticated with their primary method (e.g., password, OAuth2).

## Configuration

1.  **Enable the Plugin:**
    *   Go to "Plugin Manager" in the NocoBase admin settings and enable the "MFA" plugin.

2.  **User Configuration:**
    *   Users can enable MFA in their profile settings.
    *   They will be prompted to scan a QR code with their authenticator app and verify the setup with a one-time code.

## For Developers

This plugin extends the `@nocobase/plugin-verification` plugin to add a new `totp` verification type. It also listens for the `auth:signIn.after` event to trigger the MFA flow.
