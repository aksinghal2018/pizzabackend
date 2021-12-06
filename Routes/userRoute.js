const express=require('express')
const router=express.Router()
const app=express()
app.use(express.json())
app.use(express.urlencoded({extended:false}))
const userModel=require('../db/userSchema.js');
router.post("/adduser",(req,res)=>{
    let username=req.body.username;
    let email=req.body.email;
    let mobile=req.body.mobile;
    let age=req.body.age;
    let address=req.body.address;
    let password=req.body.password;
    //console.log(req.body)
    //insert data
    const data={username:username,email:email,mobile:mobile,age:age,address:address,password:password}
    let ins=new userModel(data);
    console.log(data)
    ins.save((err)=>{
        if(err){ res.json({err:"already added",message:"user already added."})}
        else{
        res.json({data:data,err:"",message:"user added"});
        }
    })
})
router.get("/getuser",(req,res)=>{
    userModel.find({},(err,data)=>{
        if(err) throw err;
        else{
        res.send(data);}
    })
})
router.post("/checkuser",(req,res)=>{
    let email=req.body.email;
    let password=req.body.password;
    console.log(email,password)
    userModel.find({$and:[{email:email},{password:password}]},(err,data)=>{
        if(err){
            res.json({err:err,message:"incorrect username And password."})
        }   
        else{
            if(data.length==0){
                res.json({err:"user not exist",message:"incorrect username And password."})
            }
            else{
        res.json({data:data,err:""});
            }
    }
    })
})

router.delete("/deluser/:id",(req,res)=>{
    let id=req.params.id;
    userModel.deleteOne({_id:id},(err)=>{
        if(err) throw err 
        res.send("user Data Deleted .")
    })
})
router.put("/updateuser/:id",(req,res)=>{
    let id=req.params.id;
    let username=req.body.username;
    let email=req.body.email;
    let mobile=req.body.mobile;
    let age=req.body.age;
    let address=req.body.address;
    userModel.updateOne({_id:id},{$set:{username:username,email:email,mobile:mobile,age:age,address:address}},(err)=>{
        if(err) throw err;
        else {
            res.end("user data Updated .");
        }
    })
})

//end
module.exports=router;