import Login from '../models/login.js';
import bcrypt from "bcrypt";
import * as userService from "./user-service.js";

export const save = async (login) => {
    const loginModel = new Login(login);
    return await loginModel.save();
}

export const search = async (params) => {
    return await Login.aggregate([
        {
            $match: params
        },
        {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user"
            }
        },
        {
            $unwind: '$user'
        },
        {
            $lookup: {
                from: "roles",
                localField: "role",
                foreignField: "_id",
                as: "role"
            }
        },
        {
            $unwind: '$role'
        }
    ]).exec().then( data=>{
        return data[0];
    });
}

export const findByUsername = async (username) => {
    let query = {
        username: username
    }
    return await Login.find(query).exec();
}

export const findByCredentials = async (username, password) => {
    try {
        const login = await Login.findOne({username: username});
        if (!login) {
            throw new Error("UserNotFound!");
        }
        const isMatch = await bcrypt.compare(password, login.password);
        if (!isMatch) {
            throw new Error("PasswordIsWrong!");
        }
        return login;
    } catch (error) {
        throw new Error(error.message);
    }
}
