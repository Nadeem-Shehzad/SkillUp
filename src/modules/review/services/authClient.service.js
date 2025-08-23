import { AuthPublicService } from "../../auth/index.js";


export const AuthClientService = {
   getUserInfo(userId) {
      const user = AuthPublicService.getUserInfo(userId);
      return user;
   }
}