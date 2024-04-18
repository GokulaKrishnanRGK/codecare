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
        },
        {
            $project: {
                id: "$_id",
                username: "$username",
                password: "$password",
                user: {
                    id: "$user._id",
                    username: "$user.username",
                    firstname: "$user.firstname",
                    lastname: "$user.lastname",
                    _id: 1
                },
                role: {
                    id: "$role._id",
                    name: "$role.name",
                    description: "$role.description",
                    _id: 1
                },
                tokens: "$token",
                _id: 1
            }
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
