import { AuthPublicService } from "../../../auth/index.js";


export const AuthClientService = {
   getUserInfo(userId) {
      return AuthPublicService.getUserInfo(userId);
   },

   findUser({ userId }) {
      return AuthPublicService.findUser({ userId });
   },

   updateUserData({ userId, dataToUpdate }) {
      return AuthPublicService.updateUser({ userId, dataToUpdate });
   }
}