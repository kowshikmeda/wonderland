const mongoose=require("mongoose");
const initdata=require("./data.js");
const mongourl="mongodb://127.0.0.1:27017/wonderland";
const Listings=require("../models/listing.js");
async function main(){
    await mongoose.connect(mongourl);
}
main().then((res)=>{
    console.log("connection successful");
}).catch((err)=>{
    console.log("connection unsuccessful");
})
const initdb=async function () {
    await Listings.deleteMany();
    await Listings.insertMany(initdata.data);
    console.log("data was initialized");
}
initdb();