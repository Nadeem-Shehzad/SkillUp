import jwt from 'jsonwebtoken';
import { JWT_SECRET, TOKEN_EXPIRES_IN, RF_TOKEN_EXPIRES_IN } from '../config/index.js';
import { redis } from '../config/index.js';


export const generateToken = async (user) => {

   let refreshToken = await redis.get(`rfToken:${user._id}`);
   if (!refreshToken) {
      refreshToken = jwt.sign({
         user: {
            username: user.name,
            email: user.email,
            id: user._id
         }
      }, JWT_SECRET, { expiresIn: RF_TOKEN_EXPIRES_IN });
      await redis.set(`rfToken:${user._id}`, refreshToken, 'EX', 604800);
   }

   const accessToken = jwt.sign({
      user: {
         username: user.name,
         email: user.email,
         id: user._id
      }
   }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN });

   return {
      accessToken,
      refreshToken
   }
}


export const verifyToken = (token) => {
   return jwt.verify(token, JWT_SECRET);
}