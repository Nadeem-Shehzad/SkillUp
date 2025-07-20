import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const {
    NODE_ENV,
    PORT,
    MONGO_URI,
    JWT_SECRET,
    TOKEN_EXPIRES_IN,
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET
} = process.env;

if (!NODE_ENV) throw new Error('NODE_ENV is required in .env');
if (!PORT) throw new Error('PORT is required in .env');
if (!MONGO_URI) throw new Error('MONGO_URI is required in .env');
if (!JWT_SECRET) throw new Error('JWT_SECRET is required in .env');
if (!TOKEN_EXPIRES_IN) throw new Error('TOKEN_EXPIRES_IN is required in .env');
if (!CLOUDINARY_CLOUD_NAME) throw new Error('CLOUDINARY_CLOUD_NAME is required in .env');
if (!CLOUDINARY_API_KEY) throw new Error('CLOUDINARY_API_KEY is required in .env');
if (!CLOUDINARY_API_SECRET) throw new Error('CLOUDINARY_API_SECRET is required in .env');

export {
    NODE_ENV,
    PORT,
    MONGO_URI,
    JWT_SECRET,
    TOKEN_EXPIRES_IN,
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET
}