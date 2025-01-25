import express from "express"
import cors from "cors"
import authRoutes from "./routes/auth.js"
import postsRoutes from "./routes/posts.js"
import groupsRoutes from "./routes/groups.js"
// import usersRoutes from "./routes.js/users.js"

import cookieParser from "cookie-parser"


const app = express();

const corsOptions = {
    origin: 'http://localhost:5173', // Or '*' for all origins, but use with care
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
    allowedHeaders: ['Content-Type', 'Authorization'],
 };

app.use(cors(corsOptions));

app.use(cookieParser())
app.use(express.json())

app.use("/auth", authRoutes)
app.use("/post", postsRoutes)
app.use("/groups", groupsRoutes)

// app.use("api/users", usersRoutes)



app.listen(8000, () => {
    console.log("Connected!")
})