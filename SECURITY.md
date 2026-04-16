# Security Policy

## Supported versions

| Version | Supported |
|---------|-----------|
| latest  | yes       |

## Reporting a vulnerability

Please do not report security vulnerabilities through public GitHub issues.

Send a report to **security@epsilla.com** with:

- A description of the vulnerability and its potential impact
- Steps to reproduce or a proof-of-concept
- Any suggested mitigations (optional)

You can expect an acknowledgement within **2 business days** and a status update within **7 business days**.

We will coordinate a fix and disclosure timeline with you. We ask that you do not publicly disclose the issue until a patch has been released.

## Scope

The following are in scope:

- `services/clawtrace-ingest` — ingest API authentication and tenant isolation
- `services/clawtrace-backend` — JWT auth, Cypher query injection, data access controls
- `services/clawtrace-payment` — billing logic and Stripe webhook handling
- `packages/clawtrace-ui` — frontend XSS, CSRF, auth flows
- `plugins/clawtrace` — observe key handling and event payload security

Third-party dependencies are out of scope unless the vulnerability is exploitable through ClawTrace code.
