// src/modules/auth/bullmq/workers/welcomeEmail.worker.js
import { Worker } from 'bullmq';
import { redis } from '../../../../config/index.js';
import { sendEmail } from '../../../../utils/email.js';

if (process.env.NODE_ENV !== 'test') {
  const emailWorker = new Worker(
    'emailQueue',
    async (job) => {
      const { to, subject, data } = job.data;
      console.log(`👷 Worker: Sending email to <${to}>`);

      await new Promise((res) => setTimeout(res, 3000));
      await sendEmail({ to, subject, data });

      console.log(`✅ Worker: email sent to ${to}`);
    },
    { connection: redis }
  );

  emailWorker.on('closed', () => {
    console.warn('⚠️ Worker closed unexpectedly');
  });

  emailWorker.on('error', (err) => {
    console.error('❌ Worker connection error:', err);
  });

  emailWorker.on('completed', (job) => {
    console.log(`🎉 Completed: ${job.id}`);
  });

  emailWorker.on('failed', (job, err) => {
    console.error(`❌ Worker: Failed to send email to ${job?.data?.to}`, err);
  });
}
