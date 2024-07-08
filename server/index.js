import express,{json} from "express"
import multer from "multer";
import cors from "cors";
import AWS  from 'aws-sdk';
import dotenv from 'dotenv'

dotenv.config();
const app= express();
app.use(cors());
//const upload=multer({dest:"uploadedfiles/"});
const PORT=5000;

app.use(express.json());
app.get("/",(req,res)=>{

    res.send(`<h1>Your Backend is working is fine on PORT ${PORT}</h1>`);
})

app.listen(PORT,()=>{

    console.log("Your app is working fine");
})

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION,
  });

  const s3 = new AWS.S3();

// const storage=multer.diskStorage({

//     destination: function(req,file,cb)
//     {
//         cb(null,"uploadedfiles/")
//     },
//     filename: function(req,file,cb)
//     {
//         const unitPrefix= Date.now();
//         cb(null,unitPrefix+"_"+file.originalname);
//     }
// })
// const upload = multer({ storage: storage })

const upload = multer({ storage: multer.memoryStorage() })

app.post("/upload",upload.single('file'), function (req, res, next){
    
    const params={
       
        Bucket: process.env.BUCKET_NAME,
        Key: req.file.originalname,
        Body: req.file.buffer,
    }

    s3.upload(params,(err,data)=>{

        if(err)
        {
            console.log(err)
        }

        res.send("file uploaded successfully");
    })
   // console.log(req.body);
    console.log(req.file)
    
    //res.json({msg:"file uploaded successfully"});
})

export default app;