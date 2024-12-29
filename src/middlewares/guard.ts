import { NextFunction, Request , Response } from 'express';
import { verifyToken } from '../pkg/jwt';
import AuthError from '../errors/auth-errors';

interface UserPayload {
    id: string;
    email: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: UserPayload
        }
    }
}

export const authGuard = (req: Request,res: Response,next: NextFunction) =>  {
    try {
        
        if ( !req.session?.token ) {
            throw new AuthError("user not authenticated")
        }
        
        const payload = verifyToken(req.session.token) as UserPayload;
        req.user = payload
        next()

    } catch (error: any) {
        throw new AuthError(error.message)
    }
}