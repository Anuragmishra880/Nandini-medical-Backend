import mongoose from 'mongoose'
const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            },

            quantity: {
                type: Number,
                default: 1,
                min: 1,
            },

        }
    ],
    totalQuantity: {
        type: Number
    },
    totalPrice: {
        type: Number
    },

},
    { timestamps: true },
);
cartSchema.pre("save", async function (next) {
    await this.populate("items.productId");

    this.totalQuantity = 0;
    this.totalPrice = 0;
    this?.items?.forEach((item) => {
        this.totalQuantity += item.quantity;
        this.totalPrice += item.quantity * item.productId.productPrice;
    });



    next();
})
export const Cart = mongoose.model('Cart', cartSchema)

