/**
 * Get workflow run details
 * @param {object} github - GitHub API client
 * @param {object} context - GitHub Actions context
 * @param {object} core - GitHub Actions core utilities
 * @param {string} runId - Workflow run ID
 */
module.exports = async ({ github, context, core, runId }) => {
  try {
    const runResp = await github.rest.actions.getWorkflowRun({
      owner: context.repo.owner,
      repo: context.repo.repo,
      run_id: runId,
    });

    const run = runResp && runResp.data ? runResp.data : {};

    if (core && typeof core.setOutput === 'function') {
      core.setOutput('run_url', run.html_url || '');
      core.setOutput('run_number', run.run_number || '');
      core.setOutput('head_branch', run.head_branch || '');
      core.setOutput('head_sha', run.head_sha ? String(run.head_sha).substring(0, 7) : '');
      core.setOutput('triggering_actor', run.triggering_actor ? run.triggering_actor.login : '');
    }

    return run;
  } catch (err) {
    console.error('get-workflow-details failed:', err && err.message ? err.message : err);
    throw err;
  }
};
