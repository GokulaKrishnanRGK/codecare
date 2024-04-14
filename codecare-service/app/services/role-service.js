import Role from "../models/role.js"

export const findRoleByName = async (roleName) => {
    let query = {name:roleName}
    return await Role.findOne(query).exec();
}