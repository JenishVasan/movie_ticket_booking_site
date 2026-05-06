const mongoose = require('mongoose')

const connectDb =async()=>{
    try{
        await mongoose.connect("mongodb://localhost:27017/movie_site")
        console.log("db connected")
    }catch(err){
        console.log(err)
    }
}

module.exports = connectDb