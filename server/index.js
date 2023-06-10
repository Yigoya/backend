import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import {register} from './controller/auth.js'
import { createPost } from "./controller/posts.js";
import authRoutes from './routes/auth.js'
import postsRoutes from './routes/posts.js'
import usersRoutes from './routes/users.js'
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors({
  origin:["http://localhost:3000","https://studpage.onrender.com"],
}));
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "server/public/assets");
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  });
  const upload = multer({ storage });

app.post('/auth/register',upload.single('picture'),register)
app.post('/posts',upload.single('picture'),createPost)

app.use('/auth',authRoutes)
app.use('/users',usersRoutes)
app.use('/posts',postsRoutes)
  
const PORT = process.env.PORT || 5000
mongoose.connect(process.env.MONGO_URL ,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=>{
    app.listen(PORT,()=> console.log(`the server runs in port ${PORT}`))
}).catch((e)=> console.log(`${e} did not connect`))