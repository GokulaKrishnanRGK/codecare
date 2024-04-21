import Login from '../models/login.js';

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
                tokens: "$tokens",
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

export const findByCredentials = async (username) => {
    try {
        const login = await Login.findOne({username: username});
        if (login) {
            return login;
        }
        return null;
    } catch (error) {
        throw new Error(error.message);
    }
}
