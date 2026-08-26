require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");//to hash the password being saved
const jwt = require("jsonwebtoken");//JWT is a token used when login is successfull
const Dua = require("./models/Dua");
const User = require("./models/User");//we are making signup API Now,and login also
const Tasbeeh = require("./models/Tasbeeh");//to store tasbeeh data in mongodb
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
        if(error.code === 11000){
         return response.status(409).json({
            message: "This email is already registered. Please use a different email or login.",
        });
        }
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

const token = jwt.sign({userID : user._id, role : user.role, //gies latest data, by id even if email waghera change hojaye
      
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

//function to verify admin:
function verifyAdmin(request,response,next){
    if(request.user.role !== "admin"){
        return response.status(403).json({
            message : "Admin access required"
        });
    }
    next();
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


app.get("/tasbeeh", verifyToken, async function(request,response){

    try{
        const userTasbeeh = await Tasbeeh.find({
            $or : [
                {isDefault : true},
                {userId : request.user.userID} //currently logged-in user ki MongoDB ID
            ]
        });
        console.log("MongoDB connected");
    setTimeout(function(){//so that the loading state may be visible.
    
   response.json(userTasbeeh);
    },1000);

} catch (error){
    console.error(error);
        response.status(500).json({
            message: "Failed to fetch Tasbeehs"
        });
}    

});//sending this to the server

//creating a tasbeeh on user's choice
app.post("/tasbeeh", verifyToken, async function(request,response) {
try{
  const {name , target, category} = request.body;

    if(!name || !target || !category || Number(target) <= 0){
        return response.status(400).json({
            message : "Name, target and category are required fields and target must be greater than 0"
        });
    }
const newTasbeeh = await Tasbeeh.create({//pehla code generate nhi kr rha tha id to wo undefined aarha tha to ham ny aesy kr lia(full Object).
    userId : request.user.userID,//userId ko tasbeeh ky sath save krna hai taki user ki tasbeeh save ho
    name : name,
    target : Number(target),
    category : category,
    isDefault : false
});

response.status(201).json(newTasbeeh);

}catch(error){
console.error(error);
response.status(500).json({
    message : "Failed to create Tasbeeh"
});
}

});


//Update:
app.put("/tasbeeh/:id", verifyToken,async function(request,response){
    try{
      const id = request.params.id;//frontend say id receive kr rhy hen

const tasbeehToUpdate = await Tasbeeh.findById(id);//mongodb main search kr rha hai aur yai us say aany wali id hai, aur yai object hota hai isi liye .toString() kia hai

if(!tasbeehToUpdate){//agar user aesi tashbeeh bhejy jo ky exist na krti ho to us ky liye error throw ho.
    return response.status(404).json({
        message: "Tasbeeh not found"
    })
}

if(!tasbeehToUpdate.isDefault && tasbeehToUpdate.userId.toString() !== request.user.userID){ //agar default tasbeeh hai, aur user ki apni tasbeeh hai to wo update kr skta hai wrna allow nhi hoga.    
return response.status(403).json({
    message : "You are not allowed to update this tasbeeh"
});
}
//uper wala code is liye likha taky verified user hi update kr sky, aur wo bhi apni tasbeeh hi update kr sky.
const {name, target, category} = request.body;

if (!name || !target || !category || Number(target) <= 0) {
            return response.status(400).json({
                message: "Name, target and category are required fields and target must be greater than 0"
            });
        }

tasbeehToUpdate.name = name;//actual update ho rha hai yahan par
tasbeehToUpdate.target = Number(target);
tasbeehToUpdate.category = category;
await tasbeehToUpdate.save();//mongodb main tasbeeh data save krta hai
response.json(tasbeehToUpdate);
    }catch(error){
        console.error(error);

        response.status(500).json({
            message: "Failed to update Tasbeeh"
        });
    }


});


app.delete("/tasbeeh/:id", verifyToken,async function(request,response){
    try{
     const id = request.params.id;//id lai li ham ny, URL say par wo as String hai is main. 
const tasbeehToDelete = await Tasbeeh.findById(id);

if(!tasbeehToDelete){//agr wo id exist na kry to Js returns -1. to us par ham ny message dai dia hai. 
    return response.status(404).json({
        message: "Tasbeeh not found"
    })
}

if(!tasbeehToDelete.isDefault && tasbeehToDelete.userId.toString() !== request.user.userID){ //agar default tasbeeh hai, aur user ki apni tasbeeh hai to wo update kr skta hai wrna allow nhi hoga.    
return response.status(403).json({
    message : "You are not allowed to delete this tasbeeh"
});
}
await Tasbeeh.findByIdAndDelete(id);
response.json({
    message : "Tasbeeh deleted successfully"
});
    }catch(error){
        console.error(error);
        response.status(500).json({
    message : "Failed to delete Tasbeeh"
    });
    }

});

//extra for counter
app.get("/tasbeeh/:id", verifyToken,async function(request,response){
    try{
        const id = request.params.id;
        const foundTasbeeh = await Tasbeeh.findById(id);

    if(!foundTasbeeh){
        return response.status(404).json({
            message: "Tasbeeh not found"
        });
    }

    if(!foundTasbeeh.isDefault && foundTasbeeh.userId.toString() !== request.user.userID){ //agar default tasbeeh hai, aur user ki apni tasbeeh hai to wo update kr skta hai wrna allow nhi hoga.    
return response.status(403).json({
    message : "You are not allowed to view this tasbeeh"
});

}
   response.json(foundTasbeeh);
    }catch(error){
        console.error(error);
        response.status(500).json({
    message : "Failed to fetch Tasbeeh"
    });
    }

});

//2nd Source CRUD Operations
app.get("/duas", verifyToken, async function(request,response){

    try{
        const userDuas = await Dua.find({
        userId : request.user.userID //currently logged-in user ki MongoDB ID
            
        });
    setTimeout(function(){//so that the loading state may be visible.
    
   response.json(userDuas);
    },1000);

} catch (error){
    console.error(error);
        response.status(500).json({
            message: "Failed to fetch Duas"
        });
}    

});//sending this to the server

//add dua:
app.post("/duas", verifyToken, async function(request,response) {
try{
  const {title ,arabicText, category} = request.body;

    if(!title || !arabicText || !category){
        return response.status(400).json({
            message : "Title, Arabic text, and category are required fields"
        });
    }
const newDua = await Dua.create({//pehla code generate nhi kr rha tha id to wo undefined aarha tha to ham ny aesy kr lia(full Object).
    userId : request.user.userID,//userId ko tasbeeh ky sath save krna hai taki user ki tasbeeh save ho
    title : title,
    arabicText : arabicText,
    category : category
});

response.status(201).json(newDua);

}catch(error){
console.error(error);
response.status(500).json({
    message : "Failed to create Dua"
});
}

});

//Update Dua
app.put("/duas/:id", verifyToken,async function(request,response){
    try{
      const id = request.params.id;//frontend say id receive kr rhy hen

const duaToUpdate = await Dua.findById(id);//mongodb main search kr rha hai aur yai us say aany wali id hai, aur yai object hota hai isi liye .toString() kia hai

if(!duaToUpdate){//agar user aesi tashbeeh bhejy jo ky exist na krti ho to us ky liye error throw ho.
    return response.status(404).json({
        message: "Dua not found"
    })
}

if(duaToUpdate.userId.toString() !== request.user.userID){ //agar default tasbeeh hai, aur user ki apni tasbeeh hai to wo update kr skta hai wrna allow nhi hoga.    
return response.status(403).json({
    message : "You are not allowed to update this dua"
});
}
//uper wala code is liye likha taky verified user hi update kr sky, aur wo bhi apni tasbeeh hi update kr sky.
const {title ,arabicText, category} = request.body;

if (!title || !arabicText || !category) {
            return response.status(400).json({
                message: "Title, Arabic text, and category are required fields"
            });
        }

duaToUpdate.title = title;//actual update ho rha hai yahan par
duaToUpdate.arabicText = arabicText;
duaToUpdate.category = category;
await duaToUpdate.save();//mongodb main tasbeeh data save krta hai
response.json(duaToUpdate);

    }catch(error){
        console.error(error);

        response.status(500).json({
            message: "Failed to update Dua"
        });
    }


});

//Delete Dua:
app.delete("/duas/:id", verifyToken,async function(request,response){
    try{
     const id = request.params.id;//id lai li ham ny, URL say par wo as String hai is main. 
const duaToDelete = await Dua.findById(id);

if(!duaToDelete){//agr wo id exist na kry to Js returns -1. to us par ham ny message dai dia hai. 
    return response.status(404).json({
        message: "Dua not found"
    })
}

if(duaToDelete.userId.toString() !== request.user.userID){ //agar default tasbeeh hai, aur user ki apni tasbeeh hai to wo update kr skta hai wrna allow nhi hoga.    
return response.status(403).json({
    message : "You are not allowed to delete this dua"
});
}
await Dua.findByIdAndDelete(id);
response.json({
    message : "Dua deleted successfully"
});
    }catch(error){
        console.error(error);
        response.status(500).json({
    message : "Failed to delete Dua"
    });
    }

});

//admin protected route:
app.get("/admin/dashboard",verifyToken,verifyAdmin,async function(request,response){
    try{
        const totalUsers = await User.countDocuments();
        const totalTasbeehs = await Tasbeeh.countDocuments();
        const totalDuas = await Dua.countDocuments();
        const recentUsers = await User.find().select("-_id name email role").sort({_id: -1}).limit(5);

        response.json({
            message : "Welcome Admin",
            totalUsers : totalUsers,
            totalTasbeehs : totalTasbeehs,
            totalDuas : totalDuas,
            recentUsers : recentUsers
        });

    }catch(error){
        console.error(error);
        response.status(500).json({
            message : "Failed to load Admin's Dashboard"
        });
    }
});

module.exports = app;