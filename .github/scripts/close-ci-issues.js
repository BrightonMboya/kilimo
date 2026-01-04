/**
 * Close GitHub issues related to CI failure when CI passes
 * @param {object} github - GitHub API client
 * @param {object} context - GitHub Actions context
 * @param {string} branch - Branch name
 */
module.exports = async ({ github, context, branch }) => {
  try {
    const issues = await github.rest.issues.listForRepo({
      owner: context.repo.owner,
      repo: context.repo.repo,
      state: "open",
      labels: "ci-failure,automated",
      per_page: 100,
    });

    let closedCount = 0;

    for (const issue of issues.data) {
      const title = issue.title || "";
      const body = issue.body || "";
      if (title.includes(branch) || body.includes(`Branch: \`${branch}\``)) {
        try {
          await github.rest.issues.update({
            owner: context.repo.owner,
            repo: context.repo.repo,
            issue_number: issue.number,
            state: "closed",
          });

          await github.rest.issues.createComment({
            owner: context.repo.owner,
            repo: context.repo.repo,
            issue_number: issue.number,
            body: "✅ CI is now passing! Automatically closing this issue.",
          });

          console.log(`✅ Closed issue #${issue.number}`);
          closedCount++;
        } catch (innerErr) {
          console.error(
            `Failed to close/comment issue #${issue.number}:`,
            innerErr && innerErr.message ? innerErr.message : innerErr,
          );
        }
      }
    }

    if (closedCount === 0) {
      console.log("ℹ️  No open CI failure issues found for this branch.");
    } else {
      console.log(`✅ Closed ${closedCount} issue(s) successfully.`);
    }
  } catch (err) {
    console.error(
      "close-ci-issues failed:",
      err && err.message ? err.message : err,
    );
    throw err;
  }
};
