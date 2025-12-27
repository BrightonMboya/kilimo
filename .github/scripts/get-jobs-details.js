/**
 * Get jobs details from a workflow run, including failed jobs and steps
 * @param {object} github - GitHub API client
 * @param {object} context - GitHub Actions context
 * @param {object} core - GitHub Actions core utilities
 * @param {string} runId - Workflow run ID
 */
module.exports = async ({ github, context, core, runId }) => {
  try {
    const jobsResp = await github.rest.actions.listJobsForWorkflowRun({
      owner: context.repo.owner,
      repo: context.repo.repo,
      run_id: runId,
    });

    const jobs = (jobsResp.data && jobsResp.data.jobs) || [];
    const failedJobs = jobs.filter(job => job.conclusion === 'failure');
    const failedSteps = failedJobs.flatMap(job =>
      (job.steps || []).filter(step => step.conclusion === 'failure')
        .map(step => ({
          job: job.name,
          step: step.name,
          url: job.html_url
        }))
    );

    if (core && typeof core.setOutput === 'function') {
      core.setOutput('failed_jobs', JSON.stringify(failedJobs.map(j => j.name)));
      core.setOutput('failed_steps', JSON.stringify(failedSteps));
    }

    return failedSteps;
  } catch (err) {
    console.error('get-jobs-details failed:', err && err.message ? err.message : err);
    throw err;
  }
};
