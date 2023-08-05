const AppError = require('../errorHandlers/AppError');
module.exports = function (fn){
    return async function(req,res,next){
        try {
            await fn(req,res,next);
        }catch (err){
            next(new AppError(400,err.message));
        }
    }
}