import server from './app.js';
import { logger } from "@skillup/common-utils";
import { ConnectMongoDB } from './config/index.js';
import { PORT } from './config/env.js';
import { bootstrapSuperAdmin } from './modules/admin/bootstrap.js';


const RPORT = 5000;
await ConnectMongoDB();

await bootstrapSuperAdmin();

server.listen(RPORT, () => {
   logger.info(`✅ Server Running on PORT ::: ${RPORT}`);
});