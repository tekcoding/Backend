import cors from "cors";
import express from "express";
import bodyParser from "body-parser";
// import "./db/conn.js"
import {v1routes} from "./app/route.js";
import CONFIG from "./app/utils/config.js";
import { connect } from "./db/mongodb.js";

const app = express();
const port = CONFIG.PORT;

app.use(bodyParser.json());
app.use(cors());

await connect();

v1routes(app)


app.get("/",(req,res)=>{
    return res.send({status:"OK"})
})

app.listen(port,()=>{
    console.log('Server is started on http://localhost:'+port);
})