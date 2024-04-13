import Login from '../models/login.js';
import bcrypt from "bcrypt";

export const findByUsername = async (username) => {
    let query = {
        username: username
    }
    return await Login.find(query).exec()
}

export const findByCredentials = async (username, password) => {
    try {
        const user = await Login.findOne({username: username});
        if (!user) {
            throw new Error("UserNotFound!");
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error("PasswordIsWrong!");
        }
        return user;
    } catch (error) {
        throw new Error(error.message);
    }
}
