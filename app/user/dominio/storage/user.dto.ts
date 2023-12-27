import { Request, Response } from "express";
import { plainToClass } from "class-transformer";
import { validate, ValidationOptions } from "class-validator";
import { body } from "express-validator";
import { User } from "../models/User.js";

class UserValidator {
  public data: object;

  constructor() {
    this.data = [];
  }

  public validateUser = async (req: Request, res: Response, next: any) => {
    try {
      this.data = plainToClass(User, req.body, {
        excludeExtraneousValues: true,
      });
      await validate(this.data);
      req.body = this.data; // Asignar los datos validados a req.body
      next();
    } catch (error) {
      console.error("Error de validación:", error);
      res.status(500).send(JSON.stringify(error));
    }
  };

  public usuarioDTO = 
  [
    body("name")
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .isString()
    .withMessage("El nombre debe ser de tipo string"),
    body("correo")
    .notEmpty()
    .withMessage("El correo es obligatorio")
    .isString()
    .withMessage("El correo debe ser de tipo string")
    .isEmail()
    .withMessage("Debes colocar algo como x@x.x")
  ];
}

