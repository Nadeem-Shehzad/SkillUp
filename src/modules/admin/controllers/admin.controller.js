import {
   assignAdminPermissionService,
   getAdminProfileService,
   verifyAdminService
} from "../services/admin.service.js";



export const getAdminProfile = async (req, res, next) => {
   try {
      const adminId = req.adminId;
      const admin = await getAdminProfileService({ adminId });

      res.status(200).json({ success: true, message: 'Admin Profile', data: admin })
   } catch (error) {
      next(error);
   }
}


export const assignAdminPermission = async (req, res, next) => {
   try {

      const adminId = req.params.adminId;
      const { permissions } = req.body;

      const admin = await assignAdminPermissionService({ adminId, permissions });

      res.status(200).json({ success: true, message: 'Role Assigned.', data: admin })
   } catch (error) {
      next(error);
   }
}


export const verifyAdminStatus = async (req, res, next) => {
   try {
      const adminId = req.params.adminId;
      const admin = await verifyAdminService({ adminId });
      res.status(200).json({ success: true, message: 'Admin Verified.', data: admin });
   } catch (error) {
      next(error);
   }
}