## Contributing to Cybersecurity LMS Backend

### Code Style

- Use TypeScript strictly
- Follow ESLint/Prettier rules
- Use PascalCase for classes
- Use camelCase for functions/variables
- Use UPPER_SNAKE_CASE for constants
- Add JSDoc comments for public methods

### Commit Messages

```
feat: Add new feature
fix: Bug fix
docs: Documentation update
style: Code style/formatting
refactor: Code refactoring
test: Test additions
chore: Dependencies/build changes
```

### Pull Request Process

1. Create feature branch: `git checkout -b feature/name`
2. Make changes with meaningful commits
3. Update tests
4. Update documentation
5. Create pull request with description
6. Code review and merge

### Testing Requirements

- Minimum 80% test coverage
- Unit tests for all services
- Integration tests for API endpoints
- Security tests for auth endpoints

### Database Changes

1. Update `prisma/schema.prisma`
2. Run `npm run db:migrate`
3. Update related repositories
4. Test with sample data

### Security Guidelines

- Never commit secrets or API keys
- Use environment variables
- Review OWASP Top 10
- Validate all user input
- Implement rate limiting
- Log security events
- Test for SQL injection

---

Built with ❤️ for cybersecurity education
