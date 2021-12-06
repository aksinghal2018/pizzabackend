const mongoose =require('mongoose')
const menuSchema=new mongoose.Schema({
name:{
    type:String,
    required:true,
    unique:true
},
image:{
    type:String,
    required:true,
    unique:true},
price:{
    type:Number,
    required:true,
},
category:{
    type:String,
    required:true
},
quantity:{
    type:Number,
    required:true,
}
})
module.exports=mongoose.model("menu",menuSchema)