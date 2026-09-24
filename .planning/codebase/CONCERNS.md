# Concerns

- **Testing**: Zero automated test coverage currently configured.
- **Beta Dependencies**: NextAuth is on v5 beta (`5.0.0-beta.32`), which may have breaking changes or documentation gaps.
- **Large Lockfile**: Ensure `pnpm` is consistently used, as `pnpm-lock.yaml` is massive and combining with npm/yarn could cause issues.
- **Security**: AWS S3 integration requires secure IAM policies and presigned URLs should have strict expirations. Auth implementation details need ongoing auditing.
