import express from "express"

const app = express()
import userRouter from "./routes/user.route.js"

app.use(express.json())
app.use("/api/v1/users", userRouter)

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log("Application is listening at PORT", port)
})