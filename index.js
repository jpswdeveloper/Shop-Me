const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')
const app = express()
// importing user,product,category,order route
const userRouter = require('./routes/User')
const orderRouter = require('./routes/Order')
const categoryRouter = require('./routes/Category')
const productRouter = require('./routes/Product')
// api protector
const apiProtector = require('./services/api_protecter')
// controll errors will be happened happens in the entire app
// const errorHandler = require('./services/errorHandler').default
// const errorHandler = require('./services/errorHandler')

app.use(cors())
app.use('*', cors())
app.use(express.json())
app.use(apiProtector());
// checking the api if it works or not
app.get('/', (req, res) => {
    res.status(202).json('it is working')
})

// Route
app.use('/api/v1/user', userRouter)
app.use('/api/v1/order', orderRouter)
app.use('/api/v1/category', categoryRouter)
app.use('/api/v1/product', productRouter)

// connection for our mongoose db 
mongoose.connect(process.env.Mongo_Db)
    .then(() => {
        console.log('Db is connected successfully')
    })
    .catch((err) => {
        console.log(err)
    })
// server running port
app.listen(process.env.Port || 3000, () => console.log(`server is running on http://localhost:${3000}`))
