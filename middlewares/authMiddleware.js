import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

// user auth
export const isAuth = async (req, res, next) => {
    const { token } = req.cookies;
    // validation
    if (!token)
    {
        return res.status(401).send({
            success: false,
            message: 'Unauthorized Access',
        });
    }
    const decodeData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await userModel.findById(decodeData._id);
    next();
}
// admin auth
export const isAdmin = async (req, res, next) => {
    // validation
    if (req.user.role !== "admin")
    {
        return res.status(401).send({
            success: false,
            message: 'Admin only',
        });
    }
    next();
}