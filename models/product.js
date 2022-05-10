const mongoose = require('mongoose');
const productSchema = mongoose.Schema({
    name: String,
    description: {
        type: String,
        required: true
    },
    richDescription: {
        type: String,
        default: ''
    },
    image: String,
    images: [
        {
            type: String
        }
    ],
    countInStock: {
        type: Number,
        required: true,
        min: 0,
    },
    numReviews: {
        type: Number,
        default: 0
    },
    brand: String,
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    price: {
        type: Number,
        default: 0
    },
    isFeatured: {
        default: false,
        type: Boolean
    },
    rating: {
        type: Number,
        default: 0
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
})
productSchema.virtual('id').get(function () {
    return this._id.toHexString()
})
productSchema.set('toJSON', {
    virtuals: true
})
exports.Product = mongoose.model('Product', productSchema)