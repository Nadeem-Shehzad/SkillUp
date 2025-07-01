import { createUser } from "../services/auth.services.js";

export const register = async (req, res, next) => {
    try {
        const user = await createUser(req.body);
        res.status(201).json({ success: true, message: 'User registered.', data: user });
    } catch (error) {
        next(error);
    }
}