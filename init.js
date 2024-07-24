if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const mongoose = require("mongoose");
const sampleListings = require("./data.js");
const User = require("./models/user.js");
const listing = require("./models/listing.js");

let mongodbUrl = process.env.MONGODB_URL;

async function main() {
  await mongoose.connect(mongodbUrl);
}

main()
  .then(() => {
    console.log("connection is successful");
  })
  .catch((err) => {
    console.log(err);
  });

const restorelisting = async (req, res) => {
  // await listing.deleteMany({});
  let sample = sampleListings.map((obj) => ({
    ...obj,
    owner: "669fe4790e64a391f2ade3cd",
  }));
  let restoredlisting = await listing.insertMany(sample);

  console.log(restoredlisting);
};

const deluserfxn = async (req, res) => {
  let deluser = await User.deleteMany({});
  console.log(deluser);
};

restorelisting();

// deluserfxn();
