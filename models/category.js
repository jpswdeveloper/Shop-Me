const mongoose = require('mongoose');
const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        default: ''
    },
    color: {
        type: String,
    }
})
exports.Category = mongoose.model('Category', categorySchema)
// generate id from _id 
categorySchema.virtual('id').get(function () {
    return this._id.toHexString()
})
categorySchema.set('toJSON', {
    virtuals: true
})