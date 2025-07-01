import ApiError from "../../../utils/apiError.js";
import { hashPassword } from "../../../utils/password.js"
import User from "../models/auth.model.js";



export const createUser = async ({ name, email, password }) => {

    if(await User.isEmailTaken({email})){
        throw new ApiError(400,'Email Already Registered!!!');
    }

    const hashed = await hashPassword(password);
    const user = await User.create({
        name,
        email,
        password: hashed
    });

    return user;
}