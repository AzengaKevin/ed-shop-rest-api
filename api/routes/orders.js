const express = require('express')
const uuid = require('uuid')

const router = express.Router()

router.get('/', (req, res) => {
    res.status(200).json({
        message: 'Getting all the orders'
    })
})


router.post('/', (req, res) => {
    const {productId, quantity} = req.body

    const newOrder = {
        id: uuid.v4(),
        productId,
        quantity
    }
    res.status(201).json({
        message: 'New Order Created',
        id: newOrder.id
    })
})


router.get('/:id', (req, res) => {
    const id = req.params.id

    res.status(200).json({
        message: 'Getting a specific order',
        id
    })
})



router.delete('/:id', (req, res) => {
    const id = req.params.id
    
    res.status(200).json({
        message: 'Deleting a order',
        id
    })
})

module.exports = router