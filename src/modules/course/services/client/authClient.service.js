import { AuthPublicService } from "../../../auth/index.js";


export const AuthClientService = {
   userVerification({ userId, userRole }){
      return AuthPublicService.verifyUser({ userId, userRole });
   }
}