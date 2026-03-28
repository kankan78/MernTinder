class BaseHandlers {
    constructor() {
        this.data = "Called"
    }
}

class UserRouteHandlers extends BaseHandlers {
    constructor() {
        super(); // Required to initialize 'this' from the parent class
    }
    first = (req, res, next) => {
        next();
        // res.send("First Page")
    }
    second = (req, res, next) => {
        res.send("Second Next " + this.data)
        next();
    }
    third = (req, res, next) => {
        // res.send("Third Next");
        next();
    }
};

const adminAuth = (req,res,next) => {
    const token = "xyz";
    if(token === "xyz"){
        next()
    }else{
        res.status(401).send("Wrong token")
    }
}

module.exports = { UserRouteHandlers, adminAuth };