import { Response,Request } from "express";
import { SignJWT,jwtVerify } from "jose";
import { Strategy as BearerStrategy } from "passport-http-bearer";
import passport from 'passport'

export class AuthHandler{
    private jwtSecret;

    constructor(jwtTokens:string) {
        this.jwtSecret = jwtTokens || "";
        this.configureBearerStrategy();
      }
    
      private configureBearerStrategy():void {
        passport.use(
          new BearerStrategy(async (token, done) => {
            try {
              const encoder = new TextEncoder();
              const { payload } = await jwtVerify(token, encoder.encode(this.jwtSecret));
              return done(null, payload);
            } catch (error) {
              return done(error, false);
            }
          })
        );
      }

      public requireRole(role: string):any {
        return (req: Request, res: Response, next: any) => {
          passport.authenticate(
            "bearer",
            { session: false },
            (err: any, user: any) => {
              if (err || !user || user.role !== role) {
                return res.status(403).json({ message: "Forbidden" });
              }
              req.user = user;
              next();
            }
          )(req, res, next);
        };
      }

      public validarToken = async (req: Request | any, res: Response, next: any) => {
        try {
          const encoder = new TextEncoder();
          const { payload } = await jwtVerify(
            req.headers.authorization.split(" ")[1], // Extract token from "Bearer <token>"
            encoder.encode(this.jwtSecret)
          );
          if (payload.role == "admin" || payload.role == "usuario") {
            req.user = payload;
            console.log(req.user);
            return next();
          } else {
            res
              .status(404)
              .send(JSON.stringify({ status: 404, message: "Not found role" }));
          }
        } catch (error) {
          console.log(error);
          return res.status(401).json({ message: "Unauthorized" });
        }
      };

      public crearToken = async (req: Request, res: Response) => {
        const encoder = new TextEncoder();
        if (req.body.role == "admin" || req.body.role == "usuario") {
          const jwtConstructor = await new SignJWT(req.body)
            .setProtectedHeader({ alg: "HS256", typ: "JWT" })
            .setIssuedAt()
            .setExpirationTime("1h")
            .sign(encoder.encode(this.jwtSecret));
          res.send(JSON.stringify({ role: req.body.role, token: jwtConstructor }));
        } else {
          res
            .status(400)
            .send(
              JSON.stringify({
                status: 400,
                message: "Invalid credentials required",
              })
            );
        }
      };

}