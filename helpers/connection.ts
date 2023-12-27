import mysql from "mysql2";
import { MongoClient } from "mongodb";
import { Connection } from "mysql2/typings/mysql/lib/Connection";

export class ConnectionDb {
    host: string;
    database: string;
    user: string;
    password: string;
    connection: Connection;
    uri_mongo: string;

    constructor(host: string, database: string, user: string, password: string,uri:string) {
        this.host = host;
        this.database = database;
        this.user = user;
        this.password = password;
        this.uri_mongo = uri;
        this.connection = mysql.createConnection({
            host: this.host,
            user: this.user,
            password: this.password,
            database: this.database
        });

        try {
            this.connection.connect((error) => {
                if (error) {
                    console.log("Error al conectar la base de datos", error);
                    return;
                }
                console.log("Conexión establecida");
            });
        } catch (error) {
            console.log("Error al conectar la base de datos", error);
        }

        async()=>{
            try {
                const client = await MongoClient.connect(this.uri_mongo);
                return client.db();
              } catch (error : any) {
                return { status: 500, message: error.message };
              }
        }
    }

    queryAsync = (sql: string, values: any[]): Promise<object[]> => {
        return new Promise<object[]>((resolve, reject) => {
            this.connection.query(sql, values, (err: any, results: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    };
}
