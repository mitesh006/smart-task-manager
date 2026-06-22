import express from "express"
import cookieParser from 'cookie-parser'
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.route.js"
import projectRoutes from "./routes/project.route.js"
import taskRoutes from "./routes/task.routes.js"
import userRoutes from "./routes/user.routes.js"
import cors from "cors"

const app = express()

app.use(cors({
    origin:[
        'http://localhost:5173',
        process.env.FRONTEND_URL
    ],
    credentials: true
}))

app.use(express.json())
app.use(cookieParser())

connectDB()

app.get('/', (req, res) => {
    res.sendStatus(200)
})

app.use('/api/auth', authRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/user', userRoutes)

export default app;