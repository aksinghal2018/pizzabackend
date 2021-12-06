const express = require("express");
const app = express()
const path = require("path")
const fs = require('fs')
const cors = require('cors')
const formidable = require('formidable')
app.use(cors())
var multer = require('multer');
var upload = multer();
app.set("view engine", "ejs");
app.locals.myvar = 1
app.use(express.static("uploads"));
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, './uploads/'))
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
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "audio/mpeg" || file.mimetype == "application/pdf" || file.mimetype == "video/mp4" || file.mimetype == "text/plain") {
            cb(null, true);
        } else {
            cb(null, false);
            const err = new Error('Only .png, .jpg and .jpeg format allowed!')
            err.name = 'ExtensionError'
            return cb(err);
        }
    },
}).array('myfile', 5)
app.post('/projects', function (req, res) {
    multi_upload(req, res, function (err) {
        //console.log(req.files)
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            res.status(500).send({ error: { message: `Multer uploading error1: ${err.message}` } }).end();
            return;
        } else if (err) {
            // An unknown error occurred when uploading.
            if (err.name == 'ExtensionError') {
                res.json({ err: err.name })
            } else {
                res.status(500).send({ error: { message: `unknown uploading error: ${err.message}` } }).end();
            }
            return;
        }
        const data1 = JSON.parse(fs.readFileSync('./user.json'))
        var index = -1
        data1.user.map(item => {
            if (item.email == req.body.email) {
                // console.log("login")
                index = 0
            }
        })
        if (index == -1) {
            data1.user.push({
                "id": data1.user.length,
                "name": req.body.name,
                "email": req.body.email,
                "password": req.body.password,
                "profile_img": req.files[0].filename,
            })
            fs.writeFileSync('./user.json', JSON.stringify(data1))
            // Everything went fine.
            // show file `req.files`
            // show body `req.body`
            //const data=req.files
            //console.log(data)
            //res.locals.type=req.files[1].mimetype
            // console.log({
            //     "name":req.body.name,
            //     "email":req.body.email,
            //     "password":req.body.password,
            //     "profile_img":req.files[0].filename,
            // })
            res.json({ err: "", message: "Upload Successfully" })
        }
        else {
            res.json({ err: "email id already exist" })
        }
        //res.render('response',{image1:data[0].filename,image2:data[1].filename})
    })
});

app.post('/logindata', (req, res) => {
    const form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        //console.log(fields)
        const data1 = JSON.parse(fs.readFileSync('./user.json'))
        var index = -1
        var user = {}
        data1.user.map(item => {
            if (item.email == fields.email && item.password == fields.password) {
                // console.log("login")
                index = 0
                user = item
            }
        })
        if (index == -1) {
            res.json({ err: "incorrect email id or password", data: {} })
        }
        else {
            res.json({ err: "", data: user, message: "login successfully" })
        }
    });

})
app.get("/", (req, res) => {
    res.render("upload");
})
app.get("/datalike/:userid/:postid", (req, res) => {
    const userid = req.params.userid
    const postid = req.params.postid
    console.log("data")
    var data = JSON.parse(fs.readFileSync('./user.json'))
    const post = []
    console.log(userid)
    console.log(postid)
    data.user.map(item => {
        if (item.id == userid) {
            item.posts.map(item1 => {
                if (item1.postid == postid) {
                    item1.likes = item1.likes + 1
                }
            })
        }
    })
    fs.writeFileSync('./user.json', JSON.stringify(data))
    res.end()
})
app.get("/dataremove/:userid/:postid", (req, res) => {
    const userid = req.params.userid
    const postid = req.params.postid
    var data = JSON.parse(fs.readFileSync('./user.json'))
    const post = []
    data.user.map(item => {
        if (item.id == userid) {
            item.posts.map(item1 => {
                if (item1.postid == postid) {
                    if(item1.likes>0){
                    item1.likes = item1.likes - 1}
                }
            })
        }
    })
    fs.writeFileSync('./user.json', JSON.stringify(data))
    res.end()
})
app.get("/post/:id", (req, res) => {
    const id = req.params.id
    const data = JSON.parse(fs.readFileSync('./user.json'))
    var posts = []
    data.user.map(item => {
        if (item.id == id) {
            posts = item.posts
        }
    })
    res.json({ posts: posts, message: "post found" })
})
app.post('/addpost1', function (req, res) {
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
        const data1 = JSON.parse(fs.readFileSync('./user.json'))
        var index = -1
        const datapost = {
            "userid": req.body.userid,
            "postid": 0,
            "post": req.body.post,
            "postdesc": req.body.pdesc,
            "post_img": req.files[0].filename,
            "likes": 0
        }
        console.log(req.body)
        data1.user.map(item => {
            if (item.id == req.body.userid) {
                item.posts.push({
                    "userid": req.body.userid,
                    "postid": item.posts.length,
                    "post": req.body.post,
                    "postdesc": req.body.pdesc,
                    "post_img": req.files[0].filename,
                    "likes": 0
                })
                console.log(item.posts)
            }
        })
        //console.log(data1.user)

        if (index == -1) {
            data1.user.push()
            fs.writeFileSync('./user.json', JSON.stringify(data1))
            res.json({ err: "", message: "Upload Successfully" })
        }
        else {
            res.json({ err: "email id already exist" })
        }
    })
});


app.listen(8899)