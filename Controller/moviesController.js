
let fs = require('fs');
let movies = JSON.parse(fs.readFileSync('./data/movies.json'));

exports.checkId = (req,res,next,value)=>{
    console.log('Movie id id '+value);

    let movie = movies.find(el=>el.id===value*1)

    if(!movie){
        return res.status(404).json({   // returning because we want to exit from the function
            status:"fail",
            message:"Movie with id "+value+" not found!"
        })
    }
    next()
}
// api handler functions
exports.getMovieById = (req,res)=>{
    const id = req.params.id*1 // * with 1 to convert string data into integer value

    let movie = movies.find(el=>el.id===id)

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

exports.validateBody = (req,res,next)=>{
    if(!req.body.name || !req.body.releaseYear){
        return res.status(400).json({
            status:"fail",
            message:"Not a valid movie data"
        })
    }
    next()
}
