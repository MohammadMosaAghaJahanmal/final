import { Garson } from "../models/garson.model.js";

// git all garsons
export const gitAllGarsons = async (req, res) => {
        try {
            const garsons = await Garson.find({});
            res.status(200).json({success: true, data: garsons})
        } catch (error) {
            res.status(500).json({ message: error.message })
            
        }
}

// Creat Garson

export const creatGarson = async () => {
    try {
        const {name, email} = req.body;
        const garson = await Garson.create({name, email})
        res.status(200).json({success: true, data: garson})
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
}