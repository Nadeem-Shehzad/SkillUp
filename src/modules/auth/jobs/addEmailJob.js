
import { mailQueue } from '../bullmq/queues/email.queue.js';

export const addWelcomeEmailJob = async ({ to, subject, data }) => {

  // console.log('📥 Adding welcome email job to queue...');

  await mailQueue.add('sendEmail', { to, subject, data },
    {
      jobId: `${to}-${Date.now()}`,
      removeOnComplete: true,
      removeOnFail: false,
    });

  // const jobCounts = await welcomeEmailQueue.getJobCounts();
  // console.log('📊 Job counts:', jobCounts);

  // console.log('✅ Job added to welcome email queue');
};
