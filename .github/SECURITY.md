# Security Policy

## Supported Versions

Kilimo is currently in active development. We provide security updates for the following versions:

| Version | Supported | Notes |
| ------- | --------- | ----- |
| main branch | ✅ Yes | Latest development version |
| 0.x.x (Beta) | ✅ Yes | Pre-release versions |
| < 0.1.0 | ❌ No | Early development, not recommended |

**Note:** This project is in active development. We recommend always using the latest version from the `main` branch for the most up-to-date security patches.

---

## Reporting a Vulnerability

We take security vulnerabilities in Kilimo very seriously. The platform handles sensitive agricultural data, farmer information, and business operations, making security a top priority.

### 🔒 Private Disclosure

**⚠️ IMPORTANT: Do not report security vulnerabilities through public GitHub issues, discussions, or pull requests.**

Public disclosure of security vulnerabilities could put users at risk. Instead, please report them privately using one of the following methods:

#### 1. **GitHub Security Advisories** (Preferred):
   - Navigate to the [Security tab](../../security/advisories) of this repository
   - Click "Report a vulnerability"
   - Fill out the form with comprehensive details about the vulnerability
   - Our security team will be notified immediately

#### 2. **Email** (Alternative):
   - Contact the project maintainers directly via email
   - Use a clear subject line: `[SECURITY] Vulnerability Report: <Brief Description>`
   - Include all relevant details (see below)
   - Encrypt sensitive information if possible

---

## What to Include in Your Report

To help us understand and address the vulnerability quickly, please include:

### Required Information:
- **Title**: A concise, descriptive title
- **Vulnerability Type**: e.g., SQL Injection, XSS, Authentication bypass, Data exposure
- **Affected Components**: Which part of the system? (API, Web App, Farmers App, Database, Auth)
- **Severity Assessment**: Your evaluation (Critical/High/Medium/Low)
- **Description**: Clear explanation of the vulnerability and its potential impact

### Technical Details:
- **Reproduction Steps**: Detailed step-by-step instructions
- **Proof of Concept**: Code snippets, cURL commands, or screenshots
- **Environment**: 
  - Application version or commit hash
  - Node.js version
  - Database version (PostgreSQL)
  - Operating system
  - Browser (if web-related)
- **Attack Scenario**: What could an attacker accomplish?
- **Affected Endpoints/Routes**: Specific API endpoints or pages

### Optional but Helpful:
- **Suggested Fix**: Proposed solution or mitigation
- **References**: Links to similar vulnerabilities (CVEs, security advisories)
- **Discovery Method**: How you found it (manual testing, automated tools, etc.)

---

## Response Timeline

We are committed to addressing security vulnerabilities promptly:

| Severity | Initial Response | Assessment | Fix Timeline | Public Disclosure |
|----------|-----------------|------------|--------------|-------------------|
| **Critical** | Within 24 hours | Within 48 hours | Within 7 days | After patch release |
| **High** | Within 48 hours | Within 3 days | Within 14 days | After patch release |
| **Medium** | Within 72 hours | Within 5 days | Within 30 days | With next release |
| **Low** | Within 1 week | Within 2 weeks | Next scheduled release | With release notes |

### Severity Definitions:
- **Critical**: Remote code execution, complete system compromise, mass data breach
- **High**: Authentication bypass, privilege escalation, significant data exposure
- **Medium**: Limited data exposure, DoS attacks, CSRF
- **Low**: Information disclosure, minor configuration issues

---

## Security Update Process

1. **Triage**: Our security team reviews the report and assesses severity
2. **Acknowledgment**: We confirm receipt and provide an initial assessment
3. **Investigation**: We reproduce the issue and analyze the impact
4. **Fix Development**: We develop, test, and review the fix
5. **Testing**: Comprehensive testing including regression tests
6. **Release**: Security patch released with advisory
7. **Disclosure**: Public disclosure after users have time to update

---

## 🏆 Recognition & Responsible Disclosure

We deeply appreciate security researchers who practice responsible disclosure:

### We will:
- ✅ Acknowledge your contribution in the security advisory (if you wish)
- ✅ Credit you in the CHANGELOG and release notes
- ✅ Provide updates on the status of your report
- ✅ Work with you on the disclosure timeline
- ✅ Consider adding you to our security contributors list

### We ask that you:
- 🔒 Keep the vulnerability confidential until we've released a fix
- 📧 Communicate privately through the designated channels
- ⏱️ Give us reasonable time to address the issue before public disclosure
- 🤝 Act in good faith and avoid accessing user data or disrupting services

---

## 🛡️ Security Best Practices for Developers

If you're contributing to or deploying Kilimo, follow these security guidelines:

### Environment & Configuration:
1. **Never commit secrets**: Use `.env` files and keep them in `.gitignore`
2. **Environment variables**: Store all sensitive data (API keys, DB credentials) in environment variables
3. **Rotate credentials regularly**: Change passwords, tokens, and API keys periodically
4. **Use strong passwords**: For databases, admin accounts, and services
5. **Enable 2FA**: For GitHub, cloud providers, and critical services

### Code Security:
6. **Input validation**: Always validate and sanitize user input using Zod schemas
7. **SQL injection prevention**: Use Prisma ORM properly (no raw queries without parameterization)
8. **XSS prevention**: Sanitize output, use React's built-in XSS protection
9. **CSRF protection**: Implement CSRF tokens for state-changing operations
10. **Rate limiting**: Implement rate limits on API endpoints
11. **Authentication**: Use Supabase Auth properly, never roll your own auth

### Dependencies & Updates:
12. **Keep dependencies updated**: Run `pnpm update` regularly
13. **Monitor security advisories**: Watch for `pnpm audit` warnings
14. **Review dependency changes**: Check changelogs before updating major versions
15. **Use lockfiles**: Commit `pnpm-lock.yaml` to ensure reproducible builds
16. **Automated scanning**: Our CI runs Trivy and `pnpm audit` weekly

### API & Database Security:
17. **Use HTTPS only**: Enforce HTTPS in production
18. **Implement Row Level Security (RLS)**: Configure Supabase RLS policies properly
19. **Principle of least privilege**: Grant minimum necessary database permissions
20. **API authentication**: Require authentication for all sensitive endpoints
21. **Authorization checks**: Verify user permissions on every request
22. **Audit logging**: Log security-relevant events

### Deployment Security:
23. **Container security**: Keep Docker images updated and scan for vulnerabilities
24. **Firewall rules**: Restrict network access to necessary ports only
25. **Database encryption**: Enable encryption at rest and in transit
26. **Backup security**: Encrypt backups and store securely
27. **Monitoring**: Set up alerts for suspicious activities

---

## 🔍 Automated Security Measures

Our CI/CD pipeline includes automated security checks:

### Weekly Security Scans:
- **Trivy**: Container and filesystem vulnerability scanning
- **pnpm audit**: NPM package vulnerability detection
- **SARIF Upload**: Results sent to GitHub Security tab

### Continuous Monitoring:
- **Dependabot**: Automated dependency updates
- **CodeQL**: Static analysis for code vulnerabilities
- **Lockfile verification**: Prevents supply chain attacks
- **Coverage thresholds**: Ensures code quality (80%+ coverage)

### Manual Security Reviews:
- All PRs reviewed for security implications
- Regular security audits of critical code paths
- Penetration testing before major releases

---

## 📚 Security Resources & References

### Framework-Specific Security:
- [Next.js Security Guidelines](https://nextjs.org/docs/pages/building-your-application/configuring/content-security-policy)
- [React Security Best Practices](https://react.dev/learn/sharing-state-between-components#security)
- [tRPC Security Considerations](https://trpc.io/docs/server/authorization)
- [Prisma Security Best Practices](https://www.prisma.io/docs/guides/security)
- [Supabase Security](https://supabase.com/docs/guides/platform/security)

### General Security:
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [TypeScript Security](https://www.typescriptlang.org/docs/handbook/security.html)
- [GitHub Security Advisories](https://github.com/advisories)

### Tools:
- [Trivy Scanner](https://github.com/aquasecurity/trivy)
- [npm audit](https://docs.npmjs.com/cli/v8/commands/npm-audit)
- [Snyk](https://snyk.io/)
- [OWASP ZAP](https://www.zaproxy.org/)

---

## 🚨 Known Security Considerations

### Current Security Status:
- ✅ Authentication via Supabase Auth (OAuth + Magic Links)
- ✅ Row Level Security (RLS) configured in Supabase
- ✅ Input validation using Zod schemas
- ✅ SQL injection prevention via Prisma ORM
- ✅ HTTPS enforced in production
- ✅ Weekly automated security scans
- ⚠️ 29 known dependency vulnerabilities (under review - see security scan results)

### Ongoing Security Improvements:
- 🔄 Regular security audits
- 🔄 Enhanced rate limiting
- 🔄 Advanced monitoring and alerting
- 🔄 Security headers optimization
- 🔄 Content Security Policy (CSP) implementation

---

## 📞 Contact

For security-related questions or concerns:
- **Security Reports**: Use GitHub Security Advisories (preferred)
- **General Security Questions**: Open a discussion in the repository
- **Urgent Security Issues**: Contact maintainers directly via email

---

## 📝 Security Policy Updates

This security policy is reviewed and updated regularly. Last updated: **January 3, 2026**

Changes to this policy will be documented in the repository's commit history.

---

**Thank you for helping keep Kilimo and our farming community safe!** 🌾🔒

Your responsible disclosure helps protect farmers, agricultural organizations, and their data.
