const express = require("express");
require("dotenv");
const cors = require("cors");
//,{useNewUrlParser: true}
const app = express();
//>py -m pip install pip --upgrade pip setuptools wheel
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
const mongoose = require("mongoose");
const db = mongoose.connection
db.on("error",(err)=>{console.log(err)})
db.once("open",()=> console.log("Connected to database"))
//process.env.AUTH_URI || 'mongodb://localhost:27017/port';
mongoose.connect(process.env.AUTH_URI);
const port = process.env.PORT || 5099;
const uuid = require("uuid");
const {PortfolioServices,PortfolioSchemas,Valabilitys} = require("./Model/Email");

app.post("/post-project",(req,res)=>{
    let {title,description,github_url,image_link,live_link,
        order,roles,technologies_json} = req.body;
        const id  = uuid.v4()
        
    try{
        const Enter = new PortfolioServices({
            title,
            description,
            github_url,
            live_link,
            id,
            image_link,
            order,
            roles,
            technologies_json
        });
        Enter.save().then(corn=>{
            res.status(201).json({
                message:`posted`
            })
        })
    }catch(error){
        res.status(500).json({
            message:`Error occured`,
            status:500
        })
    }
})
app.get("/get-project",(req,res)=>{
    try{
        PortfolioServices.find()
        .then(corn=>{
            res.status(200).json({
                message:`Found`,
                data:corn
            })
        })
    }catch(error){
        res.status(500).json({
            message:`${error.message}`,
            status:500
        })
    }
})
app.post("/post-email",(req,res)=>{
    let {name,email,message} = req.body;
    try{
         const PortfolioSchemass = new PortfolioSchemas({
            name,email,message
         });
         PortfolioSchemass.save().then(corn=>{
            res.status(201).json({
                message:"Posted",
            })
         })
    }catch(error){
        res.status(500).json({
            message:`${error.message}`
        })
    }
})
app.get("/get-email",(req,res)=>{
    try{
    
        PortfolioSchemas.find().then(corn=>{
            res.status(200).json({
                message:`found`,
                data:corn
            })
        })
    }catch(error){
        res.status(500).json({
            message:errors.message
        })
    }
})
app.post("/post-check",(req,res)=>{
    let { is_available} = req.body;
    try{
        const Valabilityss = new Valabilitys({
            is_available
        })
        Valabilityss.save().then(corn=>{
            res.status(201).json({
                message:"Posted",
                status:201
            })
        })
    }catch(error){
        res.status(501).json({
            message:error.message
        })
    }
})
app.get("/check",(req,res)=>{
    try{
        Valabilitys.find().then(corn=>{
            res.status(200)
            .json(
                {message:"Found",data:corn,status:200
        })
        })
    }catch(error){
        res.status(500).json({
            message:error.message,
            status:500
        })
    }
})



app.listen(port, () => {
    console.log(`My Server is running on http://localhost:${port} sy something`);
   });