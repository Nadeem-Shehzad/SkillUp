import express from 'express';

import { getUserInfo } from '../controllers/public.controller.js';


const router = express.Router();

router.route('/user/:userId').get(getUserInfo);

export default router;