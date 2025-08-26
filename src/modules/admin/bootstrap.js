import { logger } from "@skillup/common-utils";
import bcrypt from "bcrypt";

import { Admin } from "./model/admin.model.js";

import {
   SUPER_ADMIN_NAME,
   SUPER_ADMIN_EMAIL,
   SUPER_ADMIN_PASSWORD
} from "../../config/env.js";

import { AuthClientService } from "./services/client/authClient.service.js";



export async function bootstrapSuperAdmin() {
   try {

      const existing = await Admin.findOne({ roleLevel: "super-admin" });
      if (existing) {
         logger.warn(`✅ Super Admin already exists: ${existing.userId}`);
         return;
      }

      const email = SUPER_ADMIN_EMAIL;
      const password = SUPER_ADMIN_PASSWORD;
      const name = SUPER_ADMIN_NAME;

      if (!email || !password) {
         logger.warn("⚠️ Super Admin credentials missing in .env");
         return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await AuthClientService.createSuperAdmin({
         name,
         email,
         password: hashedPassword,
         role: "admin"
      });

      await Admin.create({
         userId: user._id,
         roleLevel: "super-admin",
         permissions: ["manage_courses", "manage_users", "payouts", "reports"],
      });

      logger.info("🎉 Super Admin bootstrap completed successfully ✅");
   } catch (err) {
      logger.error("❌ Error bootstrapping Super Admin:", err);
   }
}