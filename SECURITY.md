# Security Policy

## Supported versions

Security fixes are applied to the latest code on the default and production branches of this repository.

## Reporting a vulnerability

Please **do not** open a public GitHub issue for security problems.

Email the maintainer privately with:

- A short description of the issue
- Steps to reproduce (if possible)
- Impact assessment (what an attacker could do)
- Any suggested fix

We aim to acknowledge reports within a few days and will coordinate disclosure after a fix is available.

## Scope

In scope:

- The public website and hosted deployment
- Repository secrets hygiene and CI/deploy configuration
- Authentication and Firestore access control for the optional app layer

Out of scope:

- Third-party platforms mentioned in feed-control guides (Instagram, TikTok, etc.)
- Vulnerabilities that require physical access to an unlocked device
- Social-engineering attacks against individual users

## Secrets and configuration

- Never commit `.env`, service-account JSON, private keys, or Vercel/GitHub tokens
- Use `.env.example` as the template for local Firebase web config
- Firebase **web** API keys are expected to be public in client apps; protect data with Auth + Firestore security rules, not by hiding the web API key
- Keep production Firestore rules at least as strict as `firestore.rules.example` (users may only read/write their own documents)

## Deployment notes

- Production is served over HTTPS on Vercel
- Security headers (CSP, frame denial, HSTS, etc.) are configured in `vercel.json`
- The project is licensed under the **GNU General Public License v3.0** — see [LICENSE](LICENSE)
