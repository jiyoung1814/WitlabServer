class CustomAPIError extends Error{
    constructor(statusCode, message){
        super(message)
        this.statusCode = statusCode;
    }
}

const CustomError = (statusCode, msg) =>{
    return new CustomAPIError(statusCode, msg)
}

module.exports = {CustomError};