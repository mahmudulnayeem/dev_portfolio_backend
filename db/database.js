const mongoose = require('mongoose');


const databaseConnect = () =>{
    mongoose.connect(process.env.ATLASURI,{
        useNewUrlParser : true,
        useUnifiedTopology : true,
       
    }).then(()=>{
        console.log('Mongodb database connect....')
    }).catch(error=>{
        console.log(error)
    })
}
module.exports = databaseConnect;