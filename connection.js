const mongoose =require('mongoose');
async function connectMongoose(url) {
      return await mongoose.connect('mongodb://127.0.0.1:27017/test');  
}

module.exports={connectMongoose};