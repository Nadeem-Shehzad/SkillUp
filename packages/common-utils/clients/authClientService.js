import axios from "axios";
import { ApiError, constants, logger } from "../index.js";

const AUTH_SERVICE_URL = "http://localhost:5000";

export const AuthClientService = {
   async getUserInfo(userId) {
      try {
         const { data } = await axios.get(`${AUTH_SERVICE_URL}/api/v1/public/auth/user/${userId}`);

         const user = data.user;

         return user;
      } catch (err) {
         throw new ApiError(constants.INTERNAL_SERVER_ERROR, "Failed to fetch user info");
      }
   }
};