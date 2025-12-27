# Pull Request

## 📋 Summary
Provide a short, one-line summary of the change and a more detailed description below.

## ✅ Checklist — PR information
- **Type** (mark with x):
	- [ ] 🐛 Bug fix
	- [ ] ✨ Feature
	- [ ] 💥 Breaking change
	- [ ] 📚 Docs
	- [ ] 🔧 Refactor
	- [ ] ⚡ Perf
	- [ ] 🧪 Tests
	- [ ] 🚀 CI/CD

- **Packages / scopes affected** (list workspace packages or paths):
	- e.g. `packages/api`, `apps/nextjs`, `packages/db`

- **Related issues / links**:
	- Fixes #<issue-number>
	- Related: <link or issue>

## 🧾 Description
Explain what you changed and why. Include any design decisions, alternatives considered, and links to background issues or specs.

## 🧪 Testing & verification
What you ran locally or in CI to validate this change. Include commands and environment notes.

- Commands to run locally (examples):
	- Install: `pnpm install --frozen-lockfile`
	- Lint: `pnpm -w exec turbo lint`
	- Typecheck: `pnpm -w exec turbo type-check`
	- Tests: `pnpm -w exec turbo test` or run package-specific tests `pnpm --filter packages/api test`
	- Build: `pnpm -w exec turbo build`

- Test checklist:
	- [ ] CI passed (lint, test, build)
	- [ ] Unit tests added/updated (where applicable)
	- [ ] Integration tests added/updated (where applicable)

**If this PR touches the database or Prisma schema:**
- [ ] I ran `pnpm --filter packages/db prisma db push` against a test DB
- [ ] If migrations were added, include migration files and update README/deploy notes

## 🔧 Deployment / Migration notes
If this introduces breaking changes or deploy-time migrations, provide a short migration guide and order-of-operations for deploy/release.

## 📝 Checklist — contribution hygiene
- [ ] My code follows this repo's style and lint rules
- [ ] I performed a self-review of my changes
- [ ] I updated documentation where necessary
- [ ] I added tests for new behavior or fixed tests for changed behavior
- [ ] I updated package versions / changelogs for any published packages

## 📸 Screenshots / Examples (if applicable)
Add screenshots, GIFs, or sample responses to illustrate changes.

## � Notes for reviewers
- Areas to focus review on (e.g., security, performance, API surface)
- Suggested reviewers: @team/owner or specific usernames
- Suggested labels: `type:bug` / `type:feature` / `chore` / `needs-review`

---

### PR title format
Use a conventional-format title so changelogs and automation work well. Examples:
- `feat(packages/api): add new endpoint for X`
- `fix(apps/nextjs): handle Y edge-case`
- `chore(deps): update pnpm lockfile`

If this PR is a hotfix/urgent patch, prefix with `hotfix:`.

---

If you want, I can also add an automated checklist that a workflow updates after CI completes (for example marking CI status, attaching failed step logs) — say the word and I can implement it.
