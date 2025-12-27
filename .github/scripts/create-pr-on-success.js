/**
 * Create or reuse a pull request when CI passes for a branch
 * @param {object} github - GitHub API client
 * @param {object} context - GitHub Actions context
 * @param {object} core - GitHub Actions core utilities
 * @param {string} headBranch - feature branch name
 * @param {string} baseBranch - target base branch (default: develop)
 */
module.exports = async ({ github, context, core, headBranch, baseBranch }) => {
  try {
    const owner = context.repo.owner;
    const repo = context.repo.repo;

    // Resolve repository default branch and validate provided baseBranch
    let targetBase = baseBranch;
    try {
      const repoResp = await github.rest.repos.get({ owner, repo });
      const defaultBranch = repoResp && repoResp.data ? repoResp.data.default_branch : undefined;
      if (!targetBase) targetBase = defaultBranch;

      // If a base was provided, ensure it exists; if not, fallback to default
      if (baseBranch) {
        try {
          await github.rest.repos.getBranch({ owner, repo, branch: baseBranch });
        } catch (branchErr) {
          core && core.info && core.info(`Requested base branch '${baseBranch}' not found in repo; falling back to default branch '${defaultBranch}'.`);
          targetBase = defaultBranch;
        }
      }
    } catch (repoErr) {
      core && core.info && core.info('Unable to fetch repository info; will attempt to use provided base branch.');
      if (!targetBase) targetBase = 'main';
    }

  // List open PRs targeting targetBase
  const list = await github.rest.pulls.list({ owner, repo, state: 'open', base: targetBase });
  const existing = (list.data || []).find(p => p.head && p.head.ref === headBranch && p.base && p.base.ref === targetBase);

    if (existing) {
      core && core.info && core.info(`Found existing PR #${existing.number} (${existing.html_url})`);
      return { pr_number: existing.number, pr_url: existing.html_url };
    }

  const title = `Merge ${headBranch} into ${targetBase} — CI passed`;
  const body = `Automated pull request created because CI passed for branch ${headBranch}. Please review and merge.`;

  const pr = await github.rest.pulls.create({ owner, repo, head: headBranch, base: targetBase, title, body });

    core && core.info && core.info(`Created PR #${pr.data.number}: ${pr.data.html_url}`);
    return { pr_number: pr.data.number, pr_url: pr.data.html_url };
  } catch (err) {
    console.error('create-pr-on-success failed:', err && err.message ? err.message : err);
    throw err;
  }
};
