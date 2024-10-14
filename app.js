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

// this is to deal with path params
app.get('/api/v1/movies/:id',(req,res)=>{
    const id = req.params.id*1 // * with 1 to convert string data into integer value

    let movie = movies.find(el=>el.id===id)

    if(!movie){
        return res.status(404).json({   // returning because we want to exit from the function
            status:"fail",
            message:"Movie with id "+id+" not found!"
        })
    }

    res.status(200).json({
        status:"success",
        data:{
            movie:movie
        }
    })
})

app.patch('/api/v1/movies/:id',(req,res)=>{
    const id = req.params.id*1 // * with 1 to convert string data into integer value
    let movieToUpdate = movies.find(el=>el.id===id)
    if(!movieToUpdate){
        return res.status(404).json({   // returning because we want to exit from the function
            status:"fail",
            message:"Movie with id "+id+" not found!"
        })
    }

    let index = movies.indexOf(movieToUpdate);

    Object.assign(movieToUpdate,req.body);

    movies[index] = movieToUpdate;

    fs.writeFile('./data/movies.json',JSON.stringify(movies),(err)=>{
        res.status(201).json({
            status:"success",
            data:{
                movie:movieToUpdate
            }
        })
    })
})

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

app.delete('/api/v1/movies/:id',(req,res)=>{
    const id = req.params.id*1 // * with 1 to convert string data into integer value
    let movieToDelete = movies.find(el=>el.id===id)

    if(!movieToDelete){
        return res.status(404).json({   // returning because we want to exit from the function
            status:"fail",
            message:"Movie with id "+id+" not found!"
        })
    }

    let index = movies.indexOf(movieToDelete);

    movies.splice(index,1)

    fs.writeFile('./data/movies.json',JSON.stringify(movies),(err)=>{
        res.status(204).json({
            status:"success",
            data:{
                movie:null
            }
        })
    })
})

port = 8000
app.listen(port,()=>{
    console.log("server has started....")
})