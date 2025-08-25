import { AuthPublicService } from "../../../auth/index.js";


export const AuthClientService = {

   findUser({ userId }) {
      return AuthPublicService.findUser({userId});
   },

   updateUserData({ userId, dataToUpdate }) {
      return AuthPublicService.updateUser({ userId, dataToUpdate });
   }
}