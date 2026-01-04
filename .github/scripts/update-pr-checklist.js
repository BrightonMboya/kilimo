/**
 * Update PR body between markers with an automated CI checklist
 * @param {object} github - GitHub API client
 * @param {object} context - GitHub Actions context
 * @param {object} core - GitHub Actions core utilities
 * @param {string} headBranch - feature branch name
 * @param {number|string} runId - workflow run id
 * @param {string} runUrl - workflow run url
 * @param {string} conclusion - workflow run conclusion
 */
module.exports = async ({
  github,
  context,
  core,
  headBranch,
  runId,
  runUrl,
  conclusion,
}) => {
  try {
    const owner = context.repo.owner;
    const repo = context.repo.repo;

    // Find open PRs with this head
    const pulls = await github.rest.pulls.list({
      owner,
      repo,
      state: "open",
      head: `${owner}:${headBranch}`,
    });
    if (!pulls.data || pulls.data.length === 0) {
      core &&
        core.info &&
        core.info(`No open PRs found for ${headBranch}; nothing to update.`);
      return null;
    }

    const pr = pulls.data[0];

    // Get jobs for this workflow run
    const jobsResp = await github.rest.actions.listJobsForWorkflowRun({
      owner,
      repo,
      run_id: runId,
    });
    const jobs = (jobsResp.data && jobsResp.data.jobs) || [];

    const lines = [];
    lines.push(`- CI run: **${conclusion}** ([details](${runUrl}))`);

    for (const job of jobs) {
      const ok = job.conclusion === "success";
      lines.push(
        `- [${ok ? "x" : " "}] ${job.name} — ${job.conclusion || job.status}`,
      );
    }

    const failedJobs = jobs
      .filter((j) => j.conclusion && j.conclusion !== "success")
      .map((j) => j.name);

    if (failedJobs.length > 0) {
      lines.push("\n**Failed jobs:** " + failedJobs.join(", "));
      lines.push(
        "\nLogs: " +
          runUrl +
          " (use the Jobs tab and click a failing job to view detailed logs)",
      );
    }

    const start = "<!-- AUTO-CHECKLIST START -->";
    const end = "<!-- AUTO-CHECKLIST END -->";
    const newSection = `${start}\n### Automated CI checklist\n${lines.join("\n")}\n${end}`;

    let body = pr.body || "";
    if (body.includes(start)) {
      body = body.replace(
        new RegExp(`${start}[\s\S]*?${end}`, "m"),
        newSection,
      );
    } else {
      body = newSection + "\n\n" + body;
    }

    await github.rest.pulls.update({
      owner,
      repo,
      pull_number: pr.number,
      body,
    });
    core &&
      core.info &&
      core.info(`Updated PR #${pr.number} with CI checklist.`);
    return pr.number;
  } catch (err) {
    console.error(
      "update-pr-checklist failed:",
      err && err.message ? err.message : err,
    );
    throw err;
  }
};
