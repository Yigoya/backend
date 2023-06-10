import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../model/user.js'

export const register = async (req,res)=>{
    try{
        console.log(req.body)
        const {
            firstName,
            lastName,
            idNo,
            email,
            password,
            picturePath,
        } = req.body
        const user = await User.findOne({ email: email})
        
        if(user) return res.status(400).json({ msg: "user already exist"})
        const salt = await bcrypt.genSalt();
        const hashPass = await bcrypt.hash(password,salt)
        
        const newUser = new User({
            firstName,
            lastName,
            idNo,
            email,
            password:hashPass,
            picturePath,
        } );
        const savedUser = await newUser.save();
        res.status(200).json(savedUser)
    }catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const login =async (req,res)=>{
    try{
        const { email, password } = req.body;
        console.log(email,password)
        const user = await User.findOne({ email: email})
        
        if(!user) return res.status(400).json({ msg: "user doen't exist"})
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch) return res.status(400).json({ msg: "invalid password"})

        const token =  jwt.sign({id: user._id}, process.env.JWT_SECRET)
        res.status(200).json({token,user})
    }catch (err) {
        res.status(500).json({ error: err.message });
    }
};