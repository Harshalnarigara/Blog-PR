const express = require('express')

const port = 3030

const app = express()
const path = require("path")
const multer = require("multer")
const fs = require('fs')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'Images')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now()+path.extname(file.originalname))
    }
  })
  
  const upload = multer({ storage: storage })
  
  app.set("view engine" , 'ejs')

  app.use(express.urlencoded({extended : true}))
  app.use("/Images",express.static(path.join(__dirname,"Images")))

  app.get("/upload",(req , res)=>{
    res.render("upload" , {imagePath : null})
  })

  app.post("/upload",upload.single('image'),(req , res)=>{
    if(req.file){
      const imagePath = "/Images/"+ req.file.filename
      res.render("upload",{imagePath : imagePath})
    }else{
      res.render("upload",{imagePath : null})
    }
    res.send("Done")
  })

  app.post("/delete",(req , res)=>{
    const imagePath = req.body.imagePath
    const absolutePath = path.join(__dirname , imagePath)

    fs.unlink(absolutePath , (err)=>{
      if(err){
        console.log("Cannot delete file")
      }else{
        console.log("Image Deleted")
      }
      res.render('upload',{imagePath : null})
    })
  })

  app.listen(port , (req , res)=>{
    console.log("App listending at " , port)
  })