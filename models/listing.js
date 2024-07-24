const mongoose=require("mongoose");
const {Schema}=mongoose;
const review=require("./review.js");

const listSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: String,
  image: {
    filename: String,
    url: {
      type: String,
      default: "https://wallpapercave.com/wp/nsu3cSp.jpg",
      set: (v) => (v === "" ? "https://wallpapercave.com/wp/nsu3cSp.jpg" : v),
    },
  },
  price: {
    type: Number,
    required: true,
  },
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      requierd: true,
    },
    coordinates: {
      type: [Number],
    },
  },
});



listSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    await review.deleteMany({ _id: { $in: listing.reviews } });
  }
});



const listing=mongoose.model("listing",listSchema);

module.exports=listing;