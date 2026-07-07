# Security Policy

## Supported Versions

This library follows semantic versioning. Security fixes are applied to the
latest published minor release on npm.

| Version | Supported          |
| ------- | ------------------ |
| latest  | :white_check_mark: |
| older   | :x:                |

## Reporting a Vulnerability

Please **do not** open a public GitHub issue for security vulnerabilities.

Instead, report them privately via GitHub's
[Security Advisories](https://github.com/MosheHatab/multi-layer-radial-chart-native/security/advisories/new)
(the "Report a vulnerability" button on the repository's **Security** tab).

When reporting, please include:

- A description of the vulnerability and its potential impact.
- Steps to reproduce (a minimal code sample is ideal).
- Affected version(s) and environment (React Native / Expo version, platform).

## Response

- You can expect an acknowledgement within **7 days**.
- Once confirmed, a fix will be prepared and released as soon as practical,
  followed by a public advisory crediting the reporter (unless anonymity is
  requested).

## Scope

This is a client-side rendering library with **no runtime dependencies of its
own** (it relies on the `react`, `react-native`, and `react-native-svg` peer
dependencies) and performs no network access. It renders SVG from the data you
pass in. Note that any `color`, `label`, or other string values you supply are
rendered as provided — validate untrusted input on your side before passing it
to the component.
