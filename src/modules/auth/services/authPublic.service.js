import User from "../models/auth.model.js";


export const AuthPublicService = {
    async getUserInfo(userId) {
        const user = await User.findById(userId).select('name email isVerified');
        // add try-catch here to caught user nto found error!

        // console.log('***********');
        // console.log(`inside user service --> ${userId}`);
        // console.log(`inside user service --> ${user}`);
        // console.log('***********');

        return user;
    }
}