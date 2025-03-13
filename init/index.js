const mongoose=require("mongoose");
const initdata=require("./data.js");
//const mongourl="mongodb://127.0.0.1:27017/wonderland";
const Listings=require("../models/listing.js");
const altasURl="mongodb+srv://medakowshik8:AosUeOtDif7BI6SC@cluster1.eixkw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1"
;

async function main(){
    await mongoose.connect(altasURl);
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