const { Schema, model } = require('mongoose')

const regionaladminSchema = new Schema({
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
        default: 'regionaladmin'
    },
    region: {
        type: String,
        required: true
    },
     regionCode: {
        type: Number,
        required: true
    },
    region: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: ''
    },
}, { timestamps: true })


regionaladminSchema.index({
    name: 'text',
    email: 'text'
}, {
    weights: {
        name: 5,
        email: 4,
    }
})

module.exports = model('regionaladmins', regionaladminSchema)