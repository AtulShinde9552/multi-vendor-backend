const { Schema, model } = require('mongoose')

const sellerSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    role: {
        type: String,
        default: 'seller'
    },
    payment: {
        type: String,
        default: 'inactive'
    },
    method: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: ''
    },
    shopInfo: {
        type: Object,
        default: {}
    },
    status: {
        type: String,
        enum: ['pending', 'active', 'deactive'],
        default: 'active'
    },
}, { timestamps: true })


sellerSchema.index({
    email: 'text'
}, {
    weights: {
        email: 4,
    }
})

module.exports = model('sellers', sellerSchema)