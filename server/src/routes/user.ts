import { Router, Request, Response, NextFunction } from 'express';
import { IUser, UserModel } from '../models/user';
import { UserErrors } from '../errors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'



const router = Router();

router.post("/register", async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;

    try {
        const user = await UserModel.findOne({ username });

        if (user) {
            res.status(400).json({ type: UserErrors.USERNAME_ALREADY_EXISTS });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new UserModel({ username, password: hashedPassword });
        await newUser.save();

        res.json({ message: "User registered" });
        return;
    } catch (err) { 
        res.status(500).json({ type: err });
        return;

    }
});








router.post("/login" ,async (req: Request , res: Response): Promise<void> => {
    const {username, password} = req.body;
    try {
        const user: IUser = await UserModel.findOne({username})
        
        if (!user){
            res.status(400).json({type: UserErrors.NO_USER_FOUND});
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid){
            res.status(400).json({type: UserErrors.WRONG_CREDENTIALS});
            return;
        }


        const token = jwt.sign({id: user._id}, "a56787s8aof")
        res.json({token, userID: user._id})
    } catch (err) {
        res.status(500).json({ type: err});
        return;
        
    }
})


export const verifyToken = (req: Request, res: Response, next: NextFunction)=>{
    const authHeader = req.headers.authorization
    if (authHeader){
        jwt.verify(authHeader, "a56787s8aof" , (err)=>{
            if(err){
                res.sendStatus(403);
                return;
            }
            next() //used to move to the next middle wear,
                  // not important now but this verify token function will be used alot ...
        })
    }
    res.sendStatus(401);
    return;
    
};




export { router as userRouter };
