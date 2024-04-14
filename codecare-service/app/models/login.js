import mongoose, {Schema} from "mongoose";
import schemaConfig from "./schema-config.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const saltRounds = 10;

const loginSchema = new mongoose.Schema({
    id: String,
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    role: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Role"
    },
    tokens: [
        {
            token: {
                type: String
            }
        }
    ]
}, schemaConfig);

loginSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, saltRounds);
    }
    next();
});
loginSchema.methods.generateAuthToken = async function (secretKey) {
    const user = this;
    const token = jwt.sign({_id: user._id.toString()}, secretKey);
    user.tokens = user.tokens.concat({token});
    await user.save();
    return token;
};

const Login = mongoose.model('login', loginSchema);
export default Login;