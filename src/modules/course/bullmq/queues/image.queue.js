import { createQueue } from "../../../../config/bullmq.js";

export const imageQueue = createQueue('imageQueue');