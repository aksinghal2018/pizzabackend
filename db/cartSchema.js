const mongoose =require('mongoose')
const cartSchema=new mongoose.Schema({
userid:{
    type:String,
    required:true
},
orderdate:{
type:String,
required:true
},
order:{
    type:Array,
    required:true
}
})
module.exports=mongoose.model("cart",cartSchema)