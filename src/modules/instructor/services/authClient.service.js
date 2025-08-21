import { AuthPublicService } from "../../auth/index.js";


export const AuthClientService = {
   async getUserInfo(userId) {
      return await AuthPublicService.getUserInfo(userId);
   }
}