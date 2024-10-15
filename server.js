const mongoose = require('mongoose')

const dotenv = require('dotenv')
dotenv.config({path:'./config.env'})

const app = require('./app')
console.log(process.env);
const port = process.env.PORT || 8000;

mongoose.connect(process.env.CONN_STR,{
    useNewUrlParser:true
}).then((conn)=>{
    //console.log(conn)
    console.log("Db connection established...!")
}).catch((error)=>{
    console.log("Error...!")
})



app.listen(port,()=>{
    console.log("server has started....")
})