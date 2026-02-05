// const { default: mongoose, Types } = require('mongoose')
import mongoose from 'mongoose'
const ProductSchema = new mongoose.Schema({
    product_id: {
        type: String,
        required: true
    },
    product_Title: {
        type: String,
        required: true
    },
    product_Image: {
        url: {
            type: String,
            required: true
        },
        public_id: {
            type: String,
            required: true
        }
    },
    product_Price: {
        type: String,
        required: true,
    },
    product_description: {
        type: String,
        required: true
    }

},
    {
        timestamps: true
    })

export const Product = mongoose.model('Product', ProductSchema);
