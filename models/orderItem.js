const mongoose = require('mongoose');
const OrderItemSchema = mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    quantity: {
        type: Number,
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
})
OrderItemSchema.virtual('id').get(function () {
    return this._id.toHexString()
})
OrderItemSchema.set('toJSON', {
    virtuals: true
})
exports.OrderItem = mongoose.model('OrderItem', OrderItemSchema)