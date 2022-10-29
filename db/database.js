const mongoose = require('mongoose');


const databaseConnect = () =>{
    mongoose.connect(process.env.ATLAS_URI,{
        useNewUrlParser : true,
        useUnifiedTopology : true,
       
    }).then(()=>{
        console.log('Mongodb database connect....')
    }).catch(error=>{
        console.log(error)
    })
}
module.exports = databaseConnect;