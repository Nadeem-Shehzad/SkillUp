// src/modules/auth/bullmq/workers/welcomeEmail.worker.js
import { Worker } from 'bullmq';
import { redis } from '../../../../config/index.js';
import { sendEmail } from '../../../../utils/email.js';

//console.log('🧠 Email worker file executing...');

const emailWorker = new Worker('emailQueue', async job => {
    const { to, subject, data } = job.data;
    console.log(`👷 Worker: Sending email to <${to}>`);
    // Simulate processing delay

    await new Promise(res => setTimeout(res, 3000));
    await sendEmail({ to, subject, data }); // <-- send email to user

    console.log(`✅ Worker: email sent to ${to}`);
  },
  { connection: redis }
);

// console.log('⚙️ Worker instance created:', welcomeEmailWorker.name);

// welcomeEmailWorker.on('ready', () => {
//   console.log('🚀 Worker is ready and listening for jobs...');
// });

emailWorker.on('closed', () => {
  console.warn('⚠️ Worker closed unexpectedly');
});

emailWorker.on('error', (err) => {
  console.error('❌ Worker connection error:', err);
});

// Optional: Log job success/failure
emailWorker.on('completed', job => {
  console.log(`🎉 Completed: -----`);
});

emailWorker.on('failed', (job, err) => {
  console.error(`❌ Worker: Failed to send email to ${job.data.to}`, err);
});
