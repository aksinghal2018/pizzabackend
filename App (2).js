const express=require('express');
const mongoose=require('mongoose');
const PORT=8899;
const app=express();
app.use(express.json());
app.use(express.urlencoded({extended:false}));
//dbconnection 
const db="mongodb://localhost:27017/mongocrud";
const connectDB=async()=>{
    try{
      await mongoose.connect(db,{useNewUrlParser:true});
      console.log("MongoDb Connected");
    }
    catch(err){
      console.log(err.message);
    }
  }
  connectDB();
//end
const catModel=require('./db/categorySchema');
//routes 
app.post("/insertcategory",(req,res)=>{
    let cname=req.body.cname;
    let path=req.body.path;
    
    //insert data
    let ins=new catModel({cname:cname,image:path});
    ins.save((err)=>{
        if(err){ res.send("Already Added")}
        else{
        res.send("Category Added");
        }
    })
})
app.get("/getcategory",(req,res)=>{
    catModel.find({},(err,data)=>{
        if(err) throw err;
        res.send(data);
    })
})
app.delete("/delcategory/:id",(req,res)=>{
    let id=req.params.id;
    catModel.deleteOne({_id:id},(err)=>{
        if(err) throw err 
        res.send("Category Deleted")
    })
})
app.put("/updatecategory/:id",(req,res)=>{
    let id=req.params.id;
    let cname=req.body.cname;
    let path=req.body.path;
    catModel.updateOne({_id:id},{$set:{cname:cname,image:path}},(err)=>{
        if(err) throw err;
        else {
            res.end("Category Updated");
        }
    })
})
app.listen(PORT,(err)=>{
    if(err) throw err;
    console.log(`Work on ${PORT}`)
})
