const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const newUser = new Schema({
    name:{
        type: String,
        required: true,
    },
    score: {
        type: Number,
        default:0,
    },
    bestScore: {
        type: Array,
        default: [0]
    }
})

module.exports = mongoose.model('User', newUser)


