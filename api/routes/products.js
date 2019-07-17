const express = require('express')
const uuid = require('uuid')
const mongoose = require('mongoose')

const router = express.Router()


//Models
const Product = require('../models/product')

router.get('/', (req, res) => {

    Product.find()
        .select('name price _id')
        .exec()
        .then(collection => {

            const result = {
                error: false,
                count: collection.length,
                products: collection
            }

            res.status(200).json(result)

        })
        .catch(err => {
            res.status(500).json({
                error: true,
                message: err
            })
        })

})

router.post('/', (req, res) => {
    const {
        name,
        price
    } = req.body

    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name,
        price
    })

    product.save()
        .then(result => {
            res.status(201).json({
                error: false,
                id: result.id,
                request: {
                    type: "GET",
                    url: `http://localhost:3000/products/${result._id}`
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                error: true,
                message: err
            })
        })

})

router.get('/:id', (req, res) => {
    const id = req.params.id

    Product.findById({
            _id: id
        })
        .select('name price _id')
        .exec()
        .then(doc => {
            res.status(200).json({
                error: false,
                doc,
                request: {
                    type: 'GET',
                    description: 'Get all products',
                    url: `http://localhost:3000/products`
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                error: true,
                message: err
            })
        })

})

router.patch('/:id', (req, res, next) => {

    //Updating Individual Item

    /*

    const updateOps = {}

    for(let ops of req.body){
        updateOps[ops.propName] = ops.value
    }

    */

    const id = req.params.id

    const {
        name,
        price
    } = req.body

    Product.updateOne({
            _id: id
        }, {
            $set: {
                name,
                price
            }
        }).exec()
        .then(result => {
            res.status(200).json({
                error: false,
                request: {
                    type: 'GET',
                    description: 'Get product details',
                    url: `http://localhost:3000/${id}`,
                    body: {
                        name: 'String:required',
                        price: 'Number:required'
                    }
                },
                message: 'Product Updated'
            })
        })
        .catch(err => {
            res.status(500).json({
                error: true,
                message: err
            })
        })
})

router.delete('/:id', (req, res, next) => {
    const id = req.params.id

    Product.deleteOne({
            _id: id
        })
        .exec()
        .then(result => {
            res.status(200).json({
                error: false,
                message: 'Product Deleted',
                request: {
                    type: 'POST',
                    description: 'Adding new product',
                    url: `http:localhost:3000/products`
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                error: true,
                message: err
            })

        })
})


module.exports = router