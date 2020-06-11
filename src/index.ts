/* eslint-disable @typescript-eslint/camelcase */

import { debug, getInput, setFailed } from '@actions/core';
import { context, GitHub } from '@actions/github';

async function run(): Promise<void> {
  try {
    // Check for a ticket reference in the title
    const title: string = context?.payload?.pull_request?.title;

    debug(title);

    // Instantiate a GitHub Client instance
    const token = getInput('token', { required: true });
    const client = new GitHub(token);
    const pullRequest = context.issue;

    // get the title format and ticket prefix
    const ticketPrefix = getInput('ticketPrefix', { required: true });
    const comment = getInput('comment', { required: true });

    client.pulls.update({
      owner: pullRequest.owner,
      repo: pullRequest.repo,
      pull_number: pullRequest.number,
      title: `${ticketPrefix} ${title}`
    });

    client.pulls.createReview({
      owner: pullRequest.owner,
      repo: pullRequest.repo,
      pull_number: pullRequest.number,
      body: `${comment}`,
      event: 'COMMENT'
    });

    return;
  } catch (error) {
    setFailed(error.message);
  }
}

run();
