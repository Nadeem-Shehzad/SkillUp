import app from './app.js';
import { ConnectMongoDB } from './config/index.js';
import { PORT } from './config/env.js';

const RPORT = PORT || 4000;
await ConnectMongoDB();

app.listen(RPORT, () => {
   console.log(`Server Running on PORT ::: ${RPORT}`);
});