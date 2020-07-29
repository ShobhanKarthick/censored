const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const newCensor = new Schema({
    clue:{
        type: Array,
        required: true,
    },
    answer:{
        type: String,
        required: true,
    },
    link:{
        type: String,
        required: true,
    },
    blocked:{
        type: Boolean,
        default: false,
    },
    winCount :{
        type: Number,
        default:0,
    },
    lossCount :{
        type: Number,
        default:0,
    }
})

module.exports = mongoose.model('censored', newCensor)


