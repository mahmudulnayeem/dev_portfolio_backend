const jwt = require('jsonwebtoken');


module.exports.auth =async(req , res , next) => {
    const {authToken} = req.cookies;
    if(authToken){
        const deCodeToken = await jwt.verify(authToken,process.env.SECRET);
        req.email = deCodeToken.email
        req.id = deCodeToken.id
        next();

    }else{
        res.status(400).json({error:{errorMessage:['please login']}});
    }
}