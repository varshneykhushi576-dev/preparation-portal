import mongoose,{Schema} from "mongoose";

const resultSchema = new Schema({
    student:{
        type:Schema.Types.ObjectId,
        ref: "User"
    }

},{timestamps:true})

export const Result = mongoose.model("Result",resultSchema)