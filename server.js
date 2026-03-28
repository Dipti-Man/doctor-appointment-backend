
import express from "express"
import cors from 'cors'
import 'dotenv/config'
 import connectDB from "./config/mongodb.js"
 import connectCloudinary from "./config/cloudinary.js"
 import userRouter from "./routes/userRoute.js"
 import doctorRouter from "./routes/doctorRoute.js"
 import adminRouter from "./routes/adminRoute.js"

// app config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// middlewares
 app.use(express.json())
  //app.use(cors())
  //testing puerose.............
  app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200); // 🔥 THIS LINE FIXES YOUR ERROR
  }

  next();
});








// api endpoints
 app.use("/api/user", userRouter)
app.use("/api/admin", adminRouter)
 // localhost:4000/api/admin
app.use("/api/doctor", doctorRouter) 

app.get("/", (req, res) => {
  res.send("API Working")
});

// app.listen(port, () => console.log("Server started" , port))  thora chcnge for vercel deployment

if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log("Server started on port", port);
  });
}

export default app