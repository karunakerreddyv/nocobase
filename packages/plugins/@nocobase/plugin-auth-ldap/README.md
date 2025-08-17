# NocoBase LDAP Authentication Plugin

This plugin allows users to sign in to NocoBase using their credentials from an LDAP server.

## Configuration

1.  **Configure the LDAP Authenticator in NocoBase**
    *   Go to "Authentication" in the NocoBase admin settings.
    *   Add a new "LDAP" authenticator.
    *   Fill in the configuration fields for your LDAP server:
        *   **Server URL:** The URL of your LDAP server (e.g., `ldap://ldap.example.com`).
        *   **Bind DN:** The Distinguished Name (DN) of a user with permission to search the directory. Leave blank for anonymous bind.
        *   **Bind Credentials:** The password for the Bind DN.
        *   **Search Base:** The base DN from which to search for users (e.g., `ou=users,dc=example,dc=com`).
        *   **Search Filter:** The filter to use when searching for a user. `{{username}}` will be replaced with the username entered by the user (e.g., `(uid={{username}})`).
    *   Enable the authenticator.

Users will now see a form on the sign-in page to enter their LDAP username and password.
