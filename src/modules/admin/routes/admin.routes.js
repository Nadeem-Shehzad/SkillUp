import express from 'express';

import { ValidateToken } from '../../../middlewares/validateToken.js';
import {
   getAdminProfile,
   assignAdminPermission,
   verifyAdminStatus
} from '../controllers/admin.controller.js';
import { checkRole } from '../../../middlewares/checkRole.js';
import { 
   checkSuperAdminRole, 
   checkAdminExists ,
   verifyAdmin
} from '../middlewares/checkAdminRole.js';



const router = express.Router();


router.route('/profile').get(
   ValidateToken,
   verifyAdmin(),
   getAdminProfile
);


router.route('/assign-role/:adminId').post(
   ValidateToken,
   checkAdminExists(),
   checkSuperAdminRole(),
   assignAdminPermission
);

router.route('/verify-admin/:adminId').post(
   ValidateToken,
   checkAdminExists(),
   checkSuperAdminRole(),
   verifyAdminStatus
);

// verify admin authentic or not 


export default router;