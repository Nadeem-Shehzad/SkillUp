import { AuthPublicService } from "../../../auth/index.js";


export const AuthClientService = {

   findUser({ userId }) {
      return AuthPublicService.findUser({ userId });
   },

   getUserInfo(userId) {
      return AuthPublicService.getUserInfo(userId);
   },

   updateUserData({ userId, dataToUpdate }) {
      return AuthPublicService.updateUser({ userId, dataToUpdate });
   }
}