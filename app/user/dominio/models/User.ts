import { Expose,Type,Transform } from "class-transformer";
import { IsDefined,IsNumber,IsString,IsEmail } from "class-validator";
import { body } from "express-validator";

export interface UserI{
    nombre:string;
    email :string;
    password :string;
    IsAuth:number
}

export class User implements UserI{
    @Expose({name:"name"})
    @IsString()
    @IsDefined(
        {
            message:()=>{
                throw {
                    status:422,
                    message:"El parametro -> name falta"
                }
            }
        }
    )
    nombre: string;

    @Expose({name:"correo"})
    @IsString()
    @IsEmail()
    @IsDefined(
        {
            message:()=>{
                throw {
                    status:422,
                    message:"El parametro -> correo falta"
                }
            }
        }
    )
    email: string;

    @Expose({name:"contrasenia"})
    @IsString()
    @IsDefined(
        {
            message:()=>{
                throw {
                    status:422,
                    message:"El parametro -> contrasenia falta"
                }
            }
        }
    )
    password: string;

    @Expose({name:"Auth"})
    @IsNumber()
    @IsDefined(
        {
            message:()=>{
                throw {
                    status:422,
                    message:"El parametro -> Auth falta"
                }
            }
        }
    )
    IsAuth: number;

    constructor(name:string,correo:string,contrasenia:string,auth:number) {
        this.nombre = name;
        this.email = correo;
        this.password = contrasenia;
        this.IsAuth = auth;
    }

}
