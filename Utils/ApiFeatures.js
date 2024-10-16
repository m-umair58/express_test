class Apifeatures{
    constructor(query,queryStr){
        this.query=query;
        this.queryStr=queryStr;
    }
    filter(){
        let queryString = JSON.stringify(this.queryStr);
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g,(match)=>`$${match}`);
        let queryObj = JSON.parse(queryString);
        // this above code is if we want to implement conditions like greater than or gte etc
        delete queryObj.sort // if we dont add this line we arenot getting results for sorted query
        this.query = this.query.find(queryObj);   

        return this;
    }

    sort(){
        if(this.queryStr.sort){
            const sortBy = this.queryStr.sort.split(',').join(' ')
            this.query = this.query.sort(sortBy)
            console.log(sortBy)
        }else{
            this.query = this.query.sort('createdAt')
        }

        return this;
    }

    fields(){
        if(this.queryStr.fields){
            const fields = this.queryStr.fields.split(',').join(' ')
            this.query = this.query.select(fields)
        }
        else{
            this.query = this.query.select('-__v') // this is to exclude __v
        }

        return this;
    }

    paginate(){
        const page = this.queryStr.page*1 || 1;
        const limit = this.queryStr.limit*1 || 10;
        const skip = (page-1)*limit;
        this.query = this.query.skip(skip).limit(limit);

        // if(req.query.page){
        //     const moviesCount = await Movie.countDocuments();
        //     if (skip>=moviesCount){
        //         throw new Error ("This page doesn't exist")
        //     }
        // }
        return this;
    }
}

module.exports = Apifeatures;