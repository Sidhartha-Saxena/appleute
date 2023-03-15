const mongoose = require('mongoose')
mongoose.set('strictQuery',true);
const connectDB =async (url) => {
  return mongoose.connect(url).then(()=>console.log('connected')).catch((err)=>console.log(err));
}

module.exports = connectDB
