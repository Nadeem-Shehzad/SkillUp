import jwt from 'jsonwebtoken';
import { JWT_SECRET, TOKEN_EXPIRES_IN } from '../config/index.js';


export const generateToken = (user) => {
   return jwt.sign({
      user: {
         username: user.name,
         email: user.email,
         id: user._id
      }
   }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN });
}