
let fs = require('fs');
let movies = JSON.parse(fs.readFileSync('./data/movies.json'));
// api handler functions
exports.getMovieById = (req,res)=>{
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
}

exports.getAllMovies = (req,res)=>{
    res.status(200).json({
        status:"success",
        requestedAt:req.requestedAt,
        count:movies.length,
        data:{
            movies:movies
        }
    });
}

exports.updateMovie = (req,res)=>{
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
}

exports.createMovie = (req,res)=>{
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
}

exports.deleteMovieById = (req,res)=>{
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
};
