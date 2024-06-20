const { Schema, model } = require('mongoose')

const areamanagerSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    areaname: {
        type: String,
        required: true
    },
    areacode: {
        type: Number,
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
    image: {
        type: String,
        
    },
    role: {
        type: String,
        default: 'areamanager'
    },
    
})

module.exports = model('areamanagers',areamanagerSchema)