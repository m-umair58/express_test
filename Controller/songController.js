const Song = require('./../Models/songModel')
const ApiFeatures = require('./../Utils/ApiFeatures')

exports.getSongById = async (req,res)=>{
    try{
        const song = await Song.findById(req.params.id);
        res.status(201).json({
            status:"Successfull",
            data:{
                song
            }
        })
    }catch(err){
        res.status(400).json({
            status:"Failed...!",
            message:err.message
        })
    }
}


exports.getAllSongs = async (req,res)=>{
    try{
        console.log(req.query);
        const features = new ApiFeatures(Song.find(),req.query).filter().sort().paginate().searchSongs();
        let songs = await features.query;
        const songsCount = await Song.countDocuments();
        console.log('Total songs:', songsCount); // Log total song count

        res.status(200).json({
            status:"Successfull",
            totalSongs:songsCount,
            length:songs.length,
            data:{
                songs
            }
        })
    }catch(err){
        res.status(400).json({
            status:"Failed...!",
            message:err.message
        })
    }
}


exports.createSong = async (req,res)=>{
    try{
        const song = await Song.create(req.body);

        res.status(201).json({
            status:"Successfull",
            data:{
                song
            }
        })
    }catch(err){
        res.status(400).json({
            status:"Failed...!",
            message:err.message
        })
    }
}

exports.updateSong = async(req,res)=>{
    try{
        const updatedSongs = await Song.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});

        res.status(201).json({
            status:"Successfull",
            data:{
                songs:updatedSongs
            }
        })
    }catch(err){
        res.status(400).json({
            status:"Failed...!",
            message:err.message
        })
    }
}

exports.deleteSongById = async (req,res)=>{
    try{
        await Song.findByIdAndDelete(req.params.id);

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