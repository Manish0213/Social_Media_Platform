const mongoose = require("mongoose");
const mongoUrl =
  "mongodb+srv://ratnawatmanish031:sCSh1p9gpbUBgATF@cluster0.rtv6c.mongodb.net/SocialMediaPlatform?retryWrites=true&w=majority&appName=Cluster0";
const connectToDatabase = () => {
  mongoose
    .connect(mongoUrl)
    .then(() => console.log("Connected!"))
    .catch((err) => console.error("Connection Error:", err));
};

module.exports = connectToDatabase;
