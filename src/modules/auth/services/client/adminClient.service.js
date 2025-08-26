import { AdminPublicService } from "../../../admin/index.js";


export const AdminClientService = {
   createAdminAccount(userId){
      return AdminPublicService.createAdmin(userId);
   }
}