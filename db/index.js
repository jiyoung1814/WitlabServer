const mongoose = require('mongoose');



const connectDB = async (mongoURI) =>{
    await mongoose.connect(mongoURI, {})
    .then(()=> {console.log('Successfully connected to mongodb');})
    .catch((err) => {console.log(err);})
}

module.exports = connectDB
