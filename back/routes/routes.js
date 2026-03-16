import express from 'express';
import userRouter from './user.router/user.routes.js';
import GarsonRouter from './garson.router/garson.router.js';

const router = express.Router();
router.use('/api/v1/user',userRouter);

router.use('api/v1/garsons', GarsonRouter)

export default router


