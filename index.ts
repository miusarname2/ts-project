import express, { Express, Request, Response } from "express";
import { MongoClient } from "mongodb";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";

// Importacion Env
dotenv.config();

const app: Express = express();

// Settings
app.set("port",process.env.PORT || 3000);

// Middlewares
app.use(express.json());
app.use(cors({origin:"*"}));
app.use(morgan("dev"));

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(app.get("port"), () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${app.get("port")}`);
});