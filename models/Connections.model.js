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
            values: ["accepted", "rejected", "ignored", "interested"],
            message: `{value} is incorrect status type`
        }
    }
}, { timestamps: true })

connectionSchema.index({ fromUserId: 1, toUserId: 1 });

connectionSchema.pre("save", function () {
    if (this.fromUserId.equals(this.toUserId)) {
        throw new Error("Error: Cannot connect to yourself !!")
    }
})

const ConnectionModel = model("connections", connectionSchema);

module.exports = ConnectionModel;