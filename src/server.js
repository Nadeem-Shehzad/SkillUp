import app from './app.js';
import { logger } from "@skillup/common-utils";
import { ConnectMongoDB } from './config/index.js';
import { PORT } from './config/env.js';


const RPORT = PORT || 4000;
await ConnectMongoDB();

app.listen(RPORT, () => {
   logger.info(`✅ Server Running on PORT ::: ${RPORT}`);
});