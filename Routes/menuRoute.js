const express=require('express')
const PORT=8899
const router=express.Router()
//const history=require('history')
router.use(express.json())
router.use(express.urlencoded({extended:false}))
const menuModel=require('../db/menuSchema');
const cartModel=require('../db/cartSchema');
const path = require("path")
const fs = require('fs')
const cors = require('cors')
const formidable = require('formidable')
router.use(cors())
var multer = require('multer');
var upload = multer();
router.use(express.static("uploads"));
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads/'))
        //console.log(path.join(__dirname, './uploads/'))
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + file.originalname.match(/\..*$/)[0])
        //console.log(file)
    }
});
const multi_upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 1MB
    fileFilter: (req, file, cb) => {
        console.log(file.mimetype)
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" ) {
            cb(null, true);
        } else {
            cb(null, false);
            const err = new Error('Only .png, .jpg and .jpeg format allowed!')
            err.name = 'ExtensionError'
            return cb(err);
        }
    },
}).array('myfile', 1)






router.post("/addmenu",(req,res)=>{
        
    multi_upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            res.status(500).send({ error: { message: `Multer uploading error1: ${err.message}` } }).end();
            return;
        } else if (err) {
            if (err.name == 'ExtensionError') {
                res.json({ err: err.name })
            } else {
                res.status(500).send({ error: { message: `unknown uploading error: ${err.message}` } }).end();
            }
            return;
        }
        console.log(req.body)
        let name=req.body.name;
        let image=req.files[0].filename;
        let price=req.body.price;
        let category=req.body.category;
        let quantity=req.body.quantity;
        
        //insert data

        const data=({name:name,image:image,price:price,category:category,quantity:quantity})
        console.log(data)
        let ins=new menuModel({name:name,image:image,price:price,category:category,quantity:quantity});
        ins.save((err)=>{
            console.log(err)
            if(err){ res.json({err:"already added",message:"menu already added"})}
            else{
            res.json({data:data,err:"",message:"menu added successfully"});
            }
        })
})})
router.get("/getmenu",(req,res)=>{
    menuModel.find({},(err,data)=>{
        if(err) throw err;
        res.send({data:data});
    })
})
router.get("/getmenu/:id",(req,res)=>{
    const id=req.params.id
    menuModel.find({_id:id},(err,data)=>{
        if(err) throw err;
        res.send(data);
    })
})
router.delete("/delmenu/:id",(req,res)=>{
    let id=req.params.id;
    menuModel.deleteOne({_id:id},(err)=>{
        if(err) throw err 
        res.send("menu Data Deleted .")
    })
})
router.put("/updatemenu/:id",(req,res)=>{
    let id=req.params.id;
    multi_upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            res.status(500).send({ error: { message: `Multer uploading error1: ${err.message}` } }).end();
            return;
        } else if (err) {
            if (err.name == 'ExtensionError') {
                res.json({ err: err.name })
            } else {
                res.status(500).send({ error: { message: `unknown uploading error: ${err.message}` } }).end();
            }
            return;
        }
        //console.log(req.body)
        let name=req.body.name;
        let image=req.files[0].filename;
        let price=req.body.price;
        let category=req.body.category;
        let quantity=req.body.quantity;
        
        //insert data
        menuModel.find({_id:id},(err,data)=>{
            if(err) throw err;
            //console.log(data[0].image)
            fs.unlinkSync(path.join(__dirname + `/../uploads/${data[0].image}`));
        })

        const data=({name:name,image:image,price:price,category:category,quantity:quantity})
        console.log(data)
        let ins=new menuModel({name:name,image:image,price:price,category:category,quantity:quantity});
        menuModel.updateOne({_id:id},{$set:data},(err)=>{
            if(err) throw err;
            else {
                res.end("menu data Updated .");
            }
        })
        
})  
})

router.post("/ordersend",(req,res)=>{
    let id=req.body.id
    let time=req.body.date
    let order=req.body.order
    console.log(req.body)
    const orderitem=({userid:id,orderdate:time,order:order})
    let ins=new cartModel(orderitem);
        ins.save((err)=>{
            console.log(err)
            if(err){ res.json({err:"error occur",msg:"cart error"})}
            else{
            res.json({data:orderitem,err:"",msg:"order added successfully"});
            }
        })
})

router.post("/orderhistory",(req,res)=>{
    let id=req.body.id
    //console.log(req.body)
    cartModel.find({userid:id},(err,data)=>{
        if(err) throw err;
        res.send(data);
    })

})

//end
module.exports=router;