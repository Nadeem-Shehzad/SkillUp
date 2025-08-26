import { AuthPublicService } from "../../../auth/index.js";

export const AuthClientService = {
   createSuperAdmin({ name, email, password, role }) {
      return AuthPublicService.createUser({ name, email, password, role });
   },

   getAdminProfileData( userId ) {
      return AuthPublicService.getUserInfo(userId);
   },

   updateUserStatus({ userId, dataToUpdate }) {
      return AuthPublicService.updateUser({ userId, dataToUpdate });
   }
}