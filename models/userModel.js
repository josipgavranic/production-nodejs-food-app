import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'namse is required'],
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        unique: [true, 'email is already taken'],
    },
    password: {
        type: String,
        required: [true, 'password is required'],
        minLength: [6, 'password must be atleast 6 characters'],
    },
    address: {
        type: String,
        required: [true, 'address is required'],
    },
    city: {
        type: String,
        required: [true, 'city is required'],
    },
    country: {
        type: String,
        required: [true, 'country is required'],
    },
    phone: {
        type: String,
        required: [true, 'phone is required'],
    },
    profilePicture: {
        public_id: {
            type: String,
        },
        url: {
            type: String,
        }
    },
    answer: {
        type: String,
        required: [true, 'answer is required'],
    },
    role: {
        type: String,
        default: 'user',
    }
}, { timestamps: true });


// functions
// hash function
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) 
        return next();
    this.password = await bcrypt.hash(this.password, 10);
})

// compare function
userSchema.methods.comparePassword = async function(plainPassword) {
    return await bcrypt.compare(plainPassword, this.password);
}

// jwt token
userSchema.methods.generateToken = function() {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
}


export const userModel = mongoose.model('User', userSchema);
export default userModel;