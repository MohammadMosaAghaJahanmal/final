import express from 'express';
import bodyParser from 'body-parser';
import router from './routes/routes.js';
import { connectDB } from './config/db.config.js';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(express.json());
//Router 
app.use(router)


connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});