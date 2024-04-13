import jwt from "jsonwebtoken";
import Login from "../models/login.js";

const auth = async (req, res, next) => {
    try {
        console.log('>Auth');

        const authorizationHeader = req.header("Authorization");
        if (!authorizationHeader) {
            throw new Error("Authorization header missing");
        }

        const token = authorizationHeader.replace("Bearer ", "");
        const secretKey = process.env.JWT_KEY
        const decoded = jwt.verify(token, secretKey);

        const user = await Login.findOne({
            _id: decoded._id,
            "tokens.token": token,
        });

        if (!user) {
            throw new Error("UnauthorizedUserDetected!");
        }

        //user is authenticated
        //add checks to check if the user is allowed to access the path

        req.user = user;
        req.token = token;
        next();
    } catch (err) {
        res.status(401).send({ error: "Please authenticate" });
    }
};

export default auth;