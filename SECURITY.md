# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in Venom, please report it responsibly by emailing the maintainers at **security@rurox.com**.

Do not disclose the issue publicly until it has been addressed.

## Supported Versions

| Version | Supported          |
|---------|--------------------|
| 0.1.x   | :white_check_mark: |

## Security Best Practices

- Always use environment variables for API keys (see `.env.example`)
- Keep dependencies updated
- Run in production with a proper reverse proxy
- Enable rate limiting for production deployments
