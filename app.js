const express = require('express');
let fs = require('fs');

let app = express();
let movies = JSON.parse(fs.readFileSync('./data/movies.json'))

app.use(express.json())

app.get('/api/v1/movies',(req,res)=>{
    res.status(200).json({
        status:"success",
        count:movies.length,
        data:{
            movies:movies
        }
    });
});

app.post('/api/v1/movies',(req,res)=>{
    const newId = movies[movies.length-1].id+1;

    const newMovie = Object.assign({id:newId},req.body);

    movies.push(newMovie);

    fs.writeFile('./data/movies.json',JSON.stringify(movies),(err)=>{
        res.status(201).json({
            status:"success",
            data:{
                movie:newMovie
            }
        })
    })
})

port = 8000
app.listen(port,()=>{
    console.log("server has started....")
})