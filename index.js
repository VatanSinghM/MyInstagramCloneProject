const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const dotenv = require("dotenv");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");

dotenv.config();

mongoose.connect(process.env.MONGO_URL,{useNewUrlParser:true})
.then(()=>console.log("conn"))
.catch(e=>console.log(e));


const app = express();


                    //middle
app.get("/",(req,res)=>{
    res.send("welcome to home page");
})

app.get("/users",(req,res)=>{
    res.send("welcome to user page");
});


app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
 

app.listen(3000,()=>{
    console.log("backend")
})