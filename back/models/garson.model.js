import mongoose from "mongoose";


const garsonSchema = new mongoose.Schema({

    name:{
        type: String,
    },
    email:{
        type: String
    }
    
}, {timeseries: true});

export const Garson = mongoose.model('Garson', garsonSchema);
