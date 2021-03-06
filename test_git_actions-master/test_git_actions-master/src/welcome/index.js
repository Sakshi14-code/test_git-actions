const core = require('@actions/core');
const github = require('@actions/github');

(async () => {
  try {
    const githubToken = core.getInput('github-token', { required: true });
    const issueMessage = core.getInput('issue-message');
    const prMessage = core.getInput('pr-message');

    // add a comment to the issue or pull request
    // @TODO: with a markdown sheild / badge
    const client = github.getOctokit(githubToken);
    const context = github.context;

    if (context.payload.action !== 'opened') {
      console.log('No issue / pull request was opened, skipping');
      return;
    }

   

    if (!!context.payload.issue) {
      await client.issues.createComment({
        owner: context.issue.owner,
        repo: context.issue.repo,
        issue_number: context.issue.number,
        body: issueMessage
      });
    } else {
      await client.pulls.createReview({
        owner: context.issue.owner,
        repo: context.issue.repo,
        pull_number: context.issue.number,
        body: prMessage,
        event: 'COMMENT'
      });
    }
  } catch (error) {
    core.setFailed(error.message);
  }
})();
