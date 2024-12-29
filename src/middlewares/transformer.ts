import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";


export const schemeValidator = (scheme: ZodSchema) => (req: Request ,res: Response ,next: NextFunction) => {
    try {        
        scheme.parse(req.body)
        next()
    } catch (error) {
        next(error)
    }
}