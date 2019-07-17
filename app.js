const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')

//Routers
const productRoutes = require('./api/routes/products')
const orderRoutes = require('./api/routes/orders')

const app = express()

/*
app.use((req, res, next) => {
    res.status(200).json({
        message: "It's working fine"
    })
})

*/

//Getting A database Connection
mongoose.connect(`mongodb+srv://node-shop:${process.env.MONGO_ATLAS_DB_PWD}@node-collection-kd7cu.mongodb.net/test?retryWrites=true&w=majority`, {
    useNewUrlParser: true
})

//The `useMongoClient` option is no longer necessary in mongoose 5.x
// {useMongoClient: true}

//Logging Middleware
app.use(morgan('dev'))

//Body Parser MiddleWare
app.use(express.json())
app.use(express.urlencoded({
    extended: false
}))

//CORS Error Fixing
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
        return res.status(200).json({})
    }

    next();
})

//Handling Requests
app.use('/products', productRoutes)
app.use('/orders', orderRoutes)

//Handling All Other Requests
app.use((req, res, next) => {
    const error = new Error('Request Not Found')
    error.status = 404
    next(error)
})

//Handling All Errors
app.use((error, req, res, next) => {

    res.status(error.status || 500).json({
        error: {
            message: error.message
        }
    })

})

module.exports = app