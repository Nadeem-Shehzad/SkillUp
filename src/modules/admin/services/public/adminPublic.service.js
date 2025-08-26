import { Admin } from "../../model/admin.model.js";


export const AdminPublicService = {
   createAdmin(userId) {
      return Admin.create({ userId });
   }
}