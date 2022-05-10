const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    image: {
        type: String,
    },
    phone: {
        type: Number,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
})
exports.User = mongoose.model('User', userSchema)

userSchema.virtual('id').get(function () {
    return this._id.toHexString()
})
userSchema.set('toJSON', {
    virtuals: true
})