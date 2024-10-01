import { userModel } from "../models/userModel.js";
import { getDataUri } from "../utils/Feature.js";
import cloudinary from 'cloudinary';

// register
export const registerController = async (req, res) => {
    try {
        const {name, email, password, address, city, country, phone, answer} = req.body;
        // validation
        if (!name || !email || !password || !address || !city || !country || !phone || !answer) 
        {
            return res.status(500).send({
                success: false,
                message: 'Please fill all the fields',
            });
        }
        // check existing user
        const existingUser = await userModel.findOne({ email });
        // validation
        if (existingUser) 
        {
            return res.status(500).send({
                success: false,
                message: 'E-Mail already exists',
            });
        }

        const user = await userModel.create({
            name, email, password, address, city, country, phone, answer
        });
        res.status(201).send({
            success: true,
            message: 'User Registered Successfully',
            user
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Register API',
            error
        });
    }
}
// login
export const loginController = async (req, res) => {
    try {
        const {email, password} = req.body;
        // validation
        if (!email || !password)
        {
            return res.status(500).send({
                success: false,
                message: 'Please provide email or password',
            });
        }
        // check user
        const user = await userModel.findOne({ email });
        if (!user) 
        {
            return res.status(404).send({
                success: false,
                message: 'Email is not registered',
            });
        }
        //check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) 
        {
            return res.status(500).send({
                success: false,
                message: 'Invalid username or password',
            });
        }
        // token
        const token = user.generateToken();
        res.status(200).cookie('token', token, {
            expires: new Date(Date.now() + 3600000),
            secure: process.env.NODE_ENV === 'development' ? true : false,
            httpOnly: process.env.NODE_ENV === 'development' ? true : false,
            sameSite: process.env.NODE_ENV === 'development' ? true : false,
        })
        .send({
            success: true,
            message: 'Login Successfully',
            token,
            user
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Login API',
            error
        })
    }
}
// logout
export const logoutController = async (_req, res) => {
    try {
        res.status(200).cookie('token','', {
            expires: new Date(Date.now()),
            secure: process.env.NODE_ENV === 'development' ? true : false,
            httpOnly: process.env.NODE_ENV === 'development' ? true : false,
            sameSite: process.env.NODE_ENV === 'development' ? true : false,
        })
        .send({
            success: true,
            message: 'Logout Successfully',
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Logout API',
            error
        })
    }
}
// profile
export const getUserProfileController = async (req, res) => {
    const user = await userModel.findById(req.user._id);
    user.password = undefined;
    try {
        res.status(200).send({
            ssuccess: true,
            message: 'User Profile',
            user
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Profile API',
            error
        })
    }
}
// update profile
export const updateProfileController = async (req, res) => {
    try {
        const { name, email, password, address, city, country, phone } = req.body;
        const user = await userModel.findById(req.user._id);
        // validation/update
        if ( name ) 
            user.name = name;
        if ( email ) 
            user.email = email;
        if ( password ) 
            user.password = password;
        if ( address ) 
            user.address = address;
        if ( city ) 
            user.city = city;
        if ( country ) 
            user.country = country;
        if ( phone ) 
            user.phone = phone;
        // save
        await user.save();
        res.status(200).send({
            success: true,
            message: 'Profile Updated Successfully',
            user
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Update Profile API',
            error
        })
    }
}
// update password
export const updatePasswordController = async (req, res) => {
    try {
        // check user
        const user = await userModel.findById(req.user._id);
        // check old password
        const { oldPassword, newPassword } = req.body;
        // validation
        if (!oldPassword || !newPassword)
        {
            return res.status(500).send({
                success: false,
                message: 'Please provide old password and new password',
            });
        }
        const isMatch = await user.comparePassword(oldPassword);
        if (!isMatch)
        {
            return res.status(500).send({
                success: false,
                message: 'Old password is incorrect',
                })
        }
        // update password
        user.password = newPassword;
        // save
        await user.save();
        res.status(200).send({
            success: true,
            message: 'Password Updated Successfully'
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Update Password API',
            error
        })
    }
}
// update profile picture
export const updateProfilePictureController = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id);
        // get file from client photo
        const file = getDataUri(req.file);
        // delete old profile picture
        await cloudinary.v2.uploader.destroy(user.profilePicture.public_id);

        // upload new profile picture
        const cdb = await cloudinary.v2.uploader.upload(file.content);
        // update profile picture
        user.profilePicture = {
            public_id: cdb.public_id,
            url: cdb.secure_url
        }
        // save
        await user.save();
        res.status(200).send({
            success: true,
            message: 'Profile Picture Updated Successfully',
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Update Profile Picture API',
            error
        })
    }
}
// resett password
export const resetPasswordController = async (req, res) => {
    try {
        const { email, newPassword, answer } = req.body;
        // validation
        if (!email || !newPassword || !answer)
        {
            return res.status(500).send({
                success: false,
                message: 'Please provide all fields',
            });
        }
        // find user
        const user = await userModel.findOne({ email, answer });
        // validation
        if (!user)
        {
            return res.status(500).send({
                success: false,
                message: 'Email is not registered',
            });
        }
        // update password
        user.password = newPassword;
        // save
        await user.save();
        res.status(200).send({
            success: true,
            message: 'Password Updated Successfully'
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Reset Password API',
        })
    }
}