const express = require('express');
let fs = require('fs');

let app = express();
let movies = JSON.parse(fs.readFileSync('./data/movies.json'))

app.get('/api/v1/movies',(req,res)=>{
    res.status(200).json({
        status:"success",
        count:movies.length,
        data:{
            movies:movies
        }
    });
});


port = 8000
app.listen(port,()=>{
    console.log("server has started....")
})