
import { mailQueue } from '../bullmq/queues/email.queue.js';

export const addEmailJob = async ({ to, subject, data }) => {

  console.log('📥 Adding email job to queue...');

  await mailQueue.add('sendEmail', { to, subject, data },
    {
      jobId: `${to}-${Date.now()}`,
      removeOnComplete: true,
      removeOnFail: false,
    });

  // const jobCounts = await welcomeEmailQueue.getJobCounts();
  // console.log('📊 Job counts:', jobCounts);

  console.log('✅ Job added to email queue');
};
