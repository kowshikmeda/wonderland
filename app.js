if(process.env.NODE_ENV !="production"){
    require("dotenv").config();
}


const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsmate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const listingsRouter=require("./routes/listing.js");
const reviewsRouter=require("./routes/review.js");
const usersRouter=require("./routes/user.js");
const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");


const sessionOptions={
    secret:"mykeyissecret",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*48*60*60*1000,
        maxAge:7*48*60*60*1000,
        //httpOnly:true
    }

}
app.use(methodOverride("_method"));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.engine("ejs",ejsmate);
app.use(express.static(path.join(__dirname,"public")));

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// app.get("/demo",async (req,res)=>{
//     let fakeUser=new User({
//         email:"abc@gmail.com",
//         username:"delta"
//     })
//     let registeredUser=await User.register(fakeUser,"helloworld");
//     res.send(registeredUser);
// })
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    console.log("for sucess:",res.locals.success);
    console.log("for error:",res.locals.error);
    next();
})

app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",usersRouter);
async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wonderland");
}
main().then((res)=>{
    console.log("connection successful"); 
}).catch((err)=>{
    console.log("connection not successful",err);
})


// app.get("/",(req,res)=>{
    
//     res.send("hi i am  root");
// })

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found"))
})
app.use((err,req,res,next)=>{
    let {status=500,message="something went wrong"}=err;
    res.status(status).render("error.ejs",{message});
    //res.status(status).send(message);
})
app.listen("8080",(req,res)=>{
    console.log("server listening at 8080 port",app.get("view engine"));
})
