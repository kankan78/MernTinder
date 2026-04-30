const { Schema, model } = require("mongoose");

const connectionSchema = new Schema({
    fromUserId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    toUserId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: {
            values:["accepted","rejected","ignore","interested"],
            message: `{Value} is incorrect status type`
        }
    }
},{timestamps: true})

const ConnectionModel = model("connections",connectionSchema);

module.exports = ConnectionModel;