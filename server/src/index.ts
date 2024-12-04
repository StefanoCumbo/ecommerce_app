import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'


import { userRouter } from './routes/user'
import { productRouter } from './routes/product'
const app = express()

const port = process.env.PORT || 3001

//middlewear
app.use(express.json())
app.use(cors())

app.use("/user" , userRouter)
app.use("/product", productRouter)



mongoose.connect("mongodb+srv://stefanocumbo72:ecommercepassword@ecommerce.edt3v.mongodb.net/?retryWrites=true&w=majority&appName=ecommerce")
    .then(() => console.log("Connected to MongoDB"))
    .catch((err)=> console.log("Could not cinnect to MongoDB", err))


app.listen(port, ()=> {
    console.log("Server started!")
})