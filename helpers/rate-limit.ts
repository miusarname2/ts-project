import rateLimit, { RateLimitRequestHandler } from "express-rate-limit";
import { Response } from "express";

class RateLimit{
    private windowsMs : number;
    private max : number;

    constructor(windowsMs:number,max :number) {
        this.max = max;
        this.windowsMs = windowsMs;
    }

    getRateLimitFunction():RateLimitRequestHandler| any{
        return rateLimit(
            {
            windowMs : this.windowsMs,
            max:this.max,
            standardHeaders:true,
            legacyHeaders : false,
            skip:(req:any,res:Response)=>{
                if (parseInt(req.headers["content-length"]) > 690) {
                    res.status(413).json({status:413,message:"Tamaño de la solicitud Alcanzado"});
                    return true;
                }
                return false;
            },
            message:(req:any,res:Response)=>{
                res.status(429).json({status:426,message:"Limite Alcanzado"});
            }
        }
            
        )
    }
}

/*
* Uso:
* const Limiter = new RateLimit(50*100,5)
* const limitGrt = limiter.getRateLimitFunction()
*/