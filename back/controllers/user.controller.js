import { User } from "../models/user.model.js";

export const getAllUsers = async (req, res) => {
    try {
       const users = await User.find({});
       res.status(200).json({success: true, data: users});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export const createUser =  async (req, res) => {
    try {
        const { name, email } = req.body;
        const user = await User.create({name, email});
        res.status(201).json({success: true, data: user});
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}