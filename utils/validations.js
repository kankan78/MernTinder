import validator from "validator";

export const validateUserData = (req) => {
    const { firstName, lastName, emailId, password } = req.body;

    if (!firstName || !lastName) {
        throw new Error("firstName and lastName is Mandatory")
    }

    else if (!(firstName.length > 4 && firstName.length < 50)) {
        throw new Error("firstName must be between 4 & 50")
    }

    else if (!(validator.isEmail(emailId))) {
        throw new Error("Email is not Valid")
    }

    else if (!(validator.isStrongPassword(password))) {
        throw new Error("Put Strong password")
    }
}

export const validateProfileData = (req) => {
    const fields = req.body;

    const validEditFields = new Set(["firstName", "lastName","photoUrl","age","skills","gender","about"]);

    for(let key in fields){
        if(!(validEditFields.has(key))){
            throw new Error("Update Not Allowed !")
        }
        if (key == "skills" && key?.length > 10) {
            throw new Error("Update Not Allowed ! Skills limit 10");
        }
    }

}

