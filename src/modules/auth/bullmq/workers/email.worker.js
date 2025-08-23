// src/modules/auth/bullmq/workers/welcomeEmail.worker.js
import { Worker } from 'bullmq';
import { redis } from '../../../../config/index.js';
import { sendEmail } from '../../../../notifications/email.js';

import { logger } from "@skillup/common-utils";


if (process.env.NODE_ENV !== 'test') {
  const emailWorker = new Worker(
    'emailQueue',
    async (job) => {
      const { to, subject, data } = job.data;

      logger.info(`👷 Worker: Sending email to <${to}>`);

      await new Promise((res) => setTimeout(res, 3000));
      await sendEmail({ to, subject, data });

      logger.info(`✅ Worker: email sent to ${to}`);
    },
    { connection: redis }
  );

  emailWorker.on('closed', () => {
    logger.warn('⚠️ Worker closed unexpectedly');
  });

  emailWorker.on('error', (err) => {
    logger.error('❌ Worker connection error:', err);
  });

  emailWorker.on('completed', (job) => {
    logger.info(`🎉 Completed: ${job.id}`);
  });

  emailWorker.on('failed', (job, err) => {
    logger.error(`❌ Worker: Failed to send email to ${job?.data?.to}`, err);
  });

  emailWorker.on('drained', () => {
    logger.info("✨ All jobs in the queue have been processed. Queue is empty.");
  });
}
