const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
      price: Number
    }
  ],
  totalAmount: Number,
  shippingAddress: String,
  paymentStatus: String,  // pending / paid
  orderStatus: String     // placed / shipped / delivered
}, { timestamps: true });


export const Order = mongoose.model('Order', orderSchema)
