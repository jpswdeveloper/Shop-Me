const route = require('express').Router();
const mongoose = require('mongoose');
const { Order } = require('../models/order');
const { OrderItem } = require('../models/orderItem');


// add order
route.post('/addOrder', async (req, res) => {
    try {
        const orders = await Promise.all(req.body.OrderItems.map(async order => {
            const newOrder = new OrderItem({
                product: order.product,
                quantity: order.quantity
            })
            const orders = await newOrder.save();
            return orders._id;
        }))
        const newOrders = orders;
        const totalPrice = await Promise.all(newOrders.map(async id => {
            let total = await OrderItem
                .findById(id)
                .populate('product', 'price')
                .then(total => {
                    total.product.price * total.quantity
                })
                .catch(err => {
                    res.status.json({
                        message: 'Error on calculating',
                        err: err
                    })
                })
            return total;
        }))
        const latestPrice = totalPrice.reduce((a, b) => a + b, 0)
        const newAllOrders = new Order({
            orderItems: newOrders,
            shippingAddress1: req.body.shippingAddress1,
            shippingAddress2: req.body.shippingAddress2,
            phone: req.body.phone,
            status: req.body.status,
            country: req.body.country,
            user: req.body.user,
            zip: req.body.zip,
            totalPrice: latestPrice,
        })
        // finally save our data
        const ordes = await newAllOrders.save();
        res.status(202).json(ordes)
    } catch (error) {

    }
})
route.delete('/deleteProduct/:id', (req, res) => {
    Order.findByIdAndDelete(req.params.id)
        .then(ord => {
            ord.OrderItems.map(async order => {
                await OrderItem.findByIdAndDelete(order)
                    .then(() => {
                        res.status(202).json({
                            message: 'Deleted successfully'
                        })
                    })
                    .catch(err => {
                        res.status(404).json({
                            message: "Something went wrong",
                            err: err
                        })
                    })
            })
        })
        .catch(err => {
            res.status(404).json({
                message: 'Error while deleting',
                err: err
            })
        })
})
// get the product by aggregation
route.get('/allOrders', async (req, res) => {
    try {
        const allOrders = await Order.count();
        res.status(202).json(allOrders)

    } catch (error) {
        res.status(404).json({
            message: "Something went wrong",
            error: err
        })
    }
})
// sold items
route.get('/totalSales', async (req, res) => {
    try {
        const sales = Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalSales: {
                        $sum: '$totalPrice'
                    }
                }
            }
        ])
        res.status(202).json({
            sold_sales: sales.pop().totalSales
        })
    }
    catch (err) {
        res.status(404).json({
            message: "Error while calculating total sales",
            err: err
        })
    }
})
// get all order with their info detail
route.get('/order_by_id', (req, res) => {
    Order.findById(req.params.id)
        .populate('user', 'name email -passwordHash')
        .populate({
            path: 'OrderItem', populate: {
                path: 'product', populate: 'Category'
            }
        })
        .then(order => {
            res.status(202).json(order)
        })
        .catch(err => {
            res.status(404).json({
                message: "Something went wrong",
                error: err
            })
        })

})
// get all the list of the orders
route.get('/', async (req, res) => {
    // working with the filterization and limitations
    // add customization with query
    try {
        Order.find()
            .populate('user', 'name')
            .populate({
                path: 'OrderItem', populate: {
                    path: 'product', populate: 'category'
                }
            })

    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error: error
        })
    }
})
// update the status of the item
route.put('/updateOrder/:id', async (req, res) => {
    // check inserted id
    if (!mongoose.isValidObjectId(req.params.id)) {
        res.status(404).json({
            message: "ID is not correct",
        })
    }

    Orders.findByIdAndUpdate(
        req.params.id, {
        status: req.body.status,
    },
        {
            new: true
        }
    ).then(orders => {
        res.status(202).json(orders)
    })
        .catch(err => {
            res.status(404).json({
                message: "Something went wrong",
                error: err
            })
        })
})
module.exports = route