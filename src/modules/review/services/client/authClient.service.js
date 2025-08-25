import { AuthPublicService } from "../../../auth/index.js";


export const AuthClientService = {
   getUserInfo(userId) {
      return AuthPublicService.getUserInfo(userId); 
   }
}