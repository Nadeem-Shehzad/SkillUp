import { createQueue } from "../../../../config/bullmq.js";


export const imageQueue = createQueue('imageQueue');
export const imageUpdateQueue = createQueue('imageUpdateQueue');