const mongoose = require('mongoose')
const {Schema} = mongoose

const Pet = mongoose.model(
    'Pet',
    new Schema(
        {
            name:{
                type: String,
                required: true
            }

        ,
            age: {            
                type: Number,
                required: true
            },
            weight: {            
                type: Number,
                required: true
            },
            images: {
                type: Array,
                required: true
            },
            available:{
                type: Boolean,                
            },
            user: Object,
            adopter: Object
        },
        {timestamps: true},
    ),
)

module.exports = Pet