import mongoose from 'mongoose'
const cartSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            },

            quantity: {
                type: Number
            }
        }
    ],
    totalQuantity: {
        type: Number
    },
    totalPrice: {
        type: Number
    }
});

const Cart = module.exports('Cart', cartSchema)
module.exports = Cart
