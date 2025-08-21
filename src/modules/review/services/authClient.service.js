import { AuthPublicService } from "../../auth/index.js";


export const AuthClientService = {
   async getUserInfo(userId) {
      const user = await AuthPublicService.getUserInfo(userId);
      return user;
   }
}