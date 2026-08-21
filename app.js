require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");//to hash the password being saved
const jwt = require("jsonwebtoken");//JWT is a token used when login is successfull
const User = require("./models/User");//we are making signup API Now,and login also
const app = express();
app.use(cors());
let isConnected = false;
    async function connectDB(){
        if(isConnected)
            return;
        await mongoose.connect(process.env.MONGODB_URI ,{
            bufferCommands: false,
            serverSelectionTimeoutMS: 5000,
            
        });
        isConnected = true;
        console.log("MongoDB connected");
    }
app.use(express.json());//express agar frontend say json data aaye to usay read krny ky liye ready rehna
app.use(async function(request,response,next){
    try{
        await connectDB();
        next();
    }catch(error){
        console.error("DB connection failed",error);
        response.status(500).json({ message: "Database connection failed" });
    }
});
      

app.get("/",function(request,response){

response.send("Welcome to Tasbeeh Trainer API");

});

app.post("/signup", async function(request,response) {
    try{
     const{name,email,password} = request.body;//destructing same as const name = request.body.name;

     const hashedPassword = await bcrypt.hash(password,10);//hashing the password

    const newUser = await User.create({//jo data ham ny receive kia hai from frontend, us ki basis par ham aik new user bana rhy hen
        name : name,//user.create aik new user bana rha hai in database, aur yai obj ham mongodb ko bhej rhy hen
        email : email,//name: name, email:email bhi likh skty hen
       password : hashedPassword,
    });//newUser = ka matlb hai ky jab ham newUser add kr rhy hen to mongodb hamen full document return krta hai
   response.json({
            message: "Signup Successful",
            user: {
                name: newUser.name,
                email: newUser.email
            }
            });
    }catch(error){
        console.log(error);
        response.status(500).json({
            message: "Something went wrong",
        });
    }
    
});

app.post("/login", async function(request,response){
    try{
        const email = request.body.email;
const password = request.body.password;
const user = await User.findOne({email});//database say wo email dhoondh rhy hen

if(!user){//agar user nhi hai, aur user null hai to user not found message do
    return response.status(401).json({//return likhty hen taky neechy wali lines execute na hon
        message:"User Not Found",
    });
}
//agar email match kr jati hai to password check kro 
const isMatch = await bcrypt.compare(password,user.password);

if(!isMatch){//agar match nhi hua to error throw kro
    return response.status(401).json({//return likhty hen taky neechy wali lines execute na hon
        message:"Invalid Password",
    });
}

const token = jwt.sign({userID : user._id,//gies latest data, by id even if email waghera change hojaye
      
     },
      process.env.JWT_SECRET,
    {
        expiresIn : "1h",
    }
    );
    response.json({
        message : "Login Successful",token,
    });
    }
    catch(error){
        console.log(error);
         response.status(500).json({
            message: "Something went wrong",
        });
    }

});

function verifyToken(request,response,next){
    const authHeader = request.headers.authorization;
    if(!authHeader){//agar frontend request na bheje aur A.H empty ho, to authheader null hoga to us case main message jaye ga
        return response.status(401).json({
       message: "Token is missing",
        });
    }
        const token = authHeader.split(" ")[1];//spaces ki basis par todo, agar bearer shdwhi hai to hojaye ga ["Bearer" ,shdwhi] aur [1] ka matlb shdwhi hai to token aae ga
        try{
            const decoded = jwt.verify(token,process.env.JWT_SECRET);//yahan jwt verify hoga, agar token sahi hai to decode ky andar payload aaye ga
            request.user = decoded;//request ky andar user information ko append krdo
            next();//guard hai jo keh rha hai sab theek hai andar chaly jao(protected route main jao)

        }catch(error){//agar token expire ya ghalat ho to yai chalao
             return response.status(401).json({
             message: "Invalid Token"
           });
        }
    
}


app.get("/profile",verifyToken,async function(request,response){//database say name, email leni hai
    const user = await User.findById(request.user.userID);
    if(!user){
        return response.json({});
    }

    setTimeout(function(){
    response.json({
    message: "Welcome",
    name: user.name,
    email: user.email
});
    },6000);
    

    console.log("Profile request received");
});


const tasbeeh = [

    {

    id : 1,
    name : "Astaghfirullah",
    category : "Morning",
    target : 100,
    isDefault : true
},

{

    id : 2, 
    name : "Subhanallah",
    category : "Morning",
    target : 200,
    isDefault : true

}, {

    id : 3, 
    name : "Laillahaillah",
    category : "Daily",
    target : 300,
    isDefault : true

},
{

    id : 4, 
    name : "Allahu Akbar",
    category : "Evening",
    target : 100,
    isDefault : true

}, {

    id : 5, 
    name : "Alhamdulillah",
    category : "Daily",
    target : 100,
    isDefault : true

}
 

];//hamara temporary database hai yai. 



app.get("/tasbeeh", verifyToken, function(request,response){

    const userTasbeeh = tasbeeh.filter(function(item){
        return item.isDefault === true || item.userId == request.user.userID;//filter kr rhy hen taki user ki tasbeeh hi show ho
    })
    setTimeout(function(){//so that the loading state may be visible.
    
   response.json(userTasbeeh);
    },1000);
    

});//sending this to the server

//creating a tasbeeh on user's choice
app.post("/tasbeeh", verifyToken,function(request,response) {

    //this is the data that user will send to server. SO, we are checking that data first, applying validation checks.
    const {name , target, category} = request.body;

    if(!name || !target || !category || Number(target) <= 0){
        return response.status(400).json({
            message : "Name, target and category are required fields and target must be greater than 0"
        });
    }
const newTasbeeh = {//pehla code generate nhi kr rha tha id to wo undefined aarha tha to ham ny aesy kr lia(full Object).
    id : tasbeeh.length + 1,
    userId : request.user.userID,//userId ko tasbeeh ky sath save krna hai taki user ki tasbeeh save ho
    name : name,
    target : target,
    category : category
};

tasbeeh.push(newTasbeeh);
response.json(newTasbeeh);

});


//Update:
app.put("/tasbeeh/:id", verifyToken,function(request,response){
const id = request.params.id;//frontend say id receive kr rhy hen

const tasbeehToUpdate = tasbeeh.find(function(item){//finds the id in array jis ko update krna hai
 return item.id == Number(id);
});

if(!tasbeehToUpdate){//agar user aesi tashbeeh bhejy jo ky exist na krti ho to us ky liye error throw ho.
    return response.status(404).json({
        message: "Tasbeeh not found"
    })
}

if(!tasbeehToUpdate.isDefault && tasbeehToUpdate.userId !=request.user.userID){ //agar default tasbeeh hai, aur user ki apni tasbeeh hai to wo update kr skta hai wrna allow nhi hoga.    
return response.status(403).json({
    message : "You are not allowed to update this tasbeeh"
});
}
//uper wala code is liye likha taky verified user hi update kr sky, aur wo bhi apni tasbeeh hi update kr sky.
const updatedData = request.body;//frontend say jo cheez new lagani hai wo receive kia.
tasbeehToUpdate.name = updatedData.name;//actual update ho rha hai yahan par
tasbeehToUpdate.target = updatedData.target;
tasbeehToUpdate.category = updatedData.category;
response.json(tasbeehToUpdate);//frontend par usay return kry ga
});


app.delete("/tasbeeh/:id", verifyToken,function(request,response){
const id = request.params.id;//id lai li ham ny, URL say par wo as String hai is main. 
const tasbeehToDelete = tasbeeh.find(function(item){//yahan par jahan bhi existing item ki id equal hogi url say aaye id ky, to us ki index return hogi.
return item.id == Number(id);
});

if(!tasbeehToDelete){//agr wo id exist na kry to Js returns -1. to us par ham ny message dai dia hai. 
    return response.status(404).json({
        message: "Tasbeeh not found"
    })
}

if(!tasbeehToDelete.isDefault && tasbeehToDelete.userId !=request.user.userID){ //agar default tasbeeh hai, aur user ki apni tasbeeh hai to wo update kr skta hai wrna allow nhi hoga.    
return response.status(403).json({
    message : "You are not allowed to delete this tasbeeh"
});
}

const index = tasbeeh.findIndex(function(item){
    return item.id == Number(id);
});

tasbeeh.splice(index,1);

response.json({//frontend par nazar aaye ga. 
    message: "Tasbeeh deleted successfully"
});
});

//extra for counter
app.get("/tasbeeh/:id", verifyToken,function(request,response){
const id = Number(request.params.id);
const foundTasbeeh = tasbeeh.find(function(item){
        return item.id == id;
    });

    if(!foundTasbeeh){
        return response.status(404).json({
            message: "Tasbeeh not found"
        });
    }

    if(!foundTasbeeh.isDefault && foundTasbeeh.userId != request.user.userID){ //agar default tasbeeh hai, aur user ki apni tasbeeh hai to wo update kr skta hai wrna allow nhi hoga.    
return response.status(403).json({
    message : "You are not allowed to view this tasbeeh"
});

}
   response.json(foundTasbeeh);
});

module.exports = app;