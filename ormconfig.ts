import { DataSource} from "typeorm";
import path from "path";
import dotenv from "dotenv"

//for configuring env variables
dotenv.config()

const AppDataSourc=new DataSource({
    type:"mssql",
    host:process.env.HOST,
    port:1433,
    username:process.env.USER,
    password:process.env.PASSWORD,
    database:process.env.DB,
    // synchronize:true,
    // logging:true,
    entities:[path.join(__dirname,'src','entities','*.ts')],
    migrations:["migrations/*{.ts,.js}"],
    extra: {
        validateConnection: false,
        trustServerCertificate: true,
    }
    
    
})

export default AppDataSourc;