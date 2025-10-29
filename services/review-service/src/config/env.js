import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const {
   PORT,
   MONGO_URI,
   JWT_SECRET
} = process.env;

if (!PORT) throw new Error('PORT is required in .env -> review-service');
if (!MONGO_URI) throw new Error('MONGO_URI is required in .env -> review-service');
if (!JWT_SECRET) throw new Error('JWT_SECRET is required in .env -> review-service');

export {
   PORT,
   MONGO_URI,
   JWT_SECRET
}