const mongoose=require("mongoose");
const {Schema}=mongoose;

const reviewSchema=new Schema({
    rating:{
        type:Number,
        required:true,
        min:1,
        max:5
    },
    comment:{
        type:String,
        required:true
    },
    
    createdAt:{
        type:Date,
        default:new Date(),
    },
    auther:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
})

const review=mongoose.model("review",reviewSchema);
module.exports=review;