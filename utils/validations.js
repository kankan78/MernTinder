const validator = require("validator");

const validateUserData = (req)=>{
    const {firstName, lastName, email, password} = req.body;

    if(!firstName || !lastName){
        throw new Error("firstName and lastName is Mandatory") 
    }

    else if(!(firstName.length > 4 && firstName.length < 50)){
        throw new Error("firstName must be between 4 & 50") 
    }

    else if(!(validator.isEmail(email))){
        throw new Error("Email is not Valid") 
    }

    else if(!(validator.isStrongPassword(password))){
        throw new Error("Put Strong password") 
    }
}

module.exports = validateUserData;