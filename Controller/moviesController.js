const Movie = require('./../Models/movieModels')
const ApiFeatures = require('./../Utils/ApiFeatures')

exports.getHighestRated = (req,res,next)=>{
    req.query.limit = 1;
    req.query.sort = '-rating';
    next();
}
// api handler functions
exports.getMovieById = async (req,res)=>{
    try{
        // const movie = await Movie.find({_id:req.params.id});
        const movie = await Movie.findById(req.params.id);
        res.status(201).json({
            status:"Successfull",
            data:{
                movie
            }
        })
    }catch(err){
        res.status(400).json({
            status:"Failed...!",
            message:err.message
        })
    }
}

exports.getAllMovies = async (req,res)=>{
    try{
        const features = new ApiFeatures(Movie.find(),req.query).filter().sort().fields().paginate();
        let movies = await features.query;
        //console.log(req.query);
        // const excludeFields = ['page','limit','fields']

        // let queryObj = {...req.query};

        // excludeFields.forEach((el)=>{
        //     delete queryObj[el]
        // })
        // // the above code is to exculde the given fields if provided in query parameters
        // console.log(queryObj)
        //////////////////////////////////////////////////////////////////////
        // let queryStr = JSON.stringify(req.query);
        // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g,(match)=>`$${match}`);
        // let queryObj = JSON.parse(queryStr);
        // // this above code is if we want to implement conditions like greater than or gte etc
        // delete queryObj.sort // if we dont add this line we arenot getting results for sorted query
        // let query = Movie.find(queryObj);

        // sorting 
        // if(req.query.sort){
        //     const sortBy = req.query.sort.split(',').join(' ')
        //     query = query.sort(sortBy)
        //     console.log(sortBy)
        // }else{
        //     query = query.sort('createdAt')
        // }

        // fields
        // if(req.query.fields){
        //     const fields = req.query.fields.split(',').join(' ')
        //     query = query.select(fields)
        // }
        // else{
        //     query = query.select('-__v') // this is to exclude __v
        // }

        // pagination
        

        // const movies = await query;

        res.status(200).json({
            status:"Successfull",
            length:movies.length,
            data:{
                movies
            }
        })
    }catch(err){
        res.status(400).json({
            status:"Failed...!",
            message:err.message
        })
    }
}

exports.updateMovie = async(req,res)=>{
    try{
        const updatedMovies = await Movie.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});

        res.status(201).json({
            status:"Successfull",
            data:{
                movies:updatedMovies
            }
        })
    }catch(err){
        res.status(400).json({
            status:"Failed...!",
            message:err.message
        })
    }
}

exports.createMovie = async (req,res)=>{
    try{
        const movie = await Movie.create(req.body);

        res.status(201).json({
            status:"Successfull",
            data:{
                movie
            }
        })
    }catch(err){
        res.status(400).json({
            status:"Failed...!",
            message:err.message
        })
    }
}

exports.deleteMovieById = async (req,res)=>{
    try{
        await Movie.findByIdAndDelete(req.params.id);

        res.status(204).json({
            status:"Successfull",
            data:null
        })
    }catch(err){
        res.status(404).json({
            status:"Failed...!",
            message:err.message
        })
    }
};
