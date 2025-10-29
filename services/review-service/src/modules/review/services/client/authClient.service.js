import { AuthPublicService } from "../../../../../../../src/modules/auth/index.js";


export const AuthClientService = {
   getUserInfo(userId) {
      return AuthPublicService.getUserInfo(userId); 
   }
}