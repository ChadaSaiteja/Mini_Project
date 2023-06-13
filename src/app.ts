import express, { Request,Response,NextFunction } from "express";
import dotenv from "dotenv"
import AppDataSourc from "../ormconfig";
import locationRouter from "./router/locationRouter";
import projectRouter from "./router/projectRouter";
import employeeRouter from "./router/employeeRouter";

//for configuring env variables
dotenv.config();
const port=process.env.port

const app=express();

app.use(express.json());
app.use('/location',locationRouter)
app.use('/project',projectRouter)
app.use('/employee',employeeRouter)



AppDataSourc.initialize()
    .then(()=>{
        app.listen(port,()=>{
        console.log(`server listening on ${port}`)
        })
    })
    .catch((err)=>{console.log(err)})