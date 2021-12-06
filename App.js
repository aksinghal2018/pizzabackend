const express=require('express')
const PORT=8899
const app=express()
const cors=require('cors')
const connectDB = require('./Connection/connectDB')
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cors())
app.use('/images',express.static('uploads'))
const userRoutes=require('./Routes/userRoute')
const menuRoutes=require('./Routes/menuRoute')
//dbconnection 
connectDB();
//end
app.get('/',(req,res)=>{
res.json({data:"get request"})    
})
//User
app.use('/',userRoutes)
//end

//Menu
app.use('/',menuRoutes)
//end
app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });
  