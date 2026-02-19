// const { default: mongoose, Types } = require('mongoose')
import mongoose from 'mongoose'
const ProductSchema = new mongoose.Schema({
   
    productTitle: {
        type: String,
        required: true
    },
    productImage: {
        url: {
            type: String,
            required: true
        },
        publicId: {
            type: String,
            required: true
        }
    },
    productStock: {
        type: String,
        // required: true
    },
    productPrice: {
        type: Number,
        required: true,
    },
    productDescription: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    }

},
    {
        timestamps: true
    })

export const Product = mongoose.model('Product', ProductSchema);
