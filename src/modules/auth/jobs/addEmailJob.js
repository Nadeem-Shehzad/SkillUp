import { logger } from "@skillup/common-utils";

import { mailQueue } from '../bullmq/queues/email.queue.js';

export const addEmailJob = async ({ to, subject, data }) => {

  logger.info('📥 Adding email job to queue...');

  await mailQueue.add('sendEmail', { to, subject, data },
    {
      jobId: `${to}-${Date.now()}`,
      removeOnComplete: true,
      removeOnFail: false,
    });

  // const jobCounts = await welcomeEmailQueue.getJobCounts();
  // console.log('📊 Job counts:', jobCounts);

  logger.info('✅ Job added to email queue');
};
