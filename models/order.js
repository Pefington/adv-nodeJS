/* eslint-disable func-names */
import mongoose from 'mongoose';

const { Schema } = mongoose;

const orderSchema = new Schema({
  user: {
    email: {
      type: String,
      ref: 'User',
      required: true,
    },
    id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  products: [
    {
      type: Object,
      required: true,
    },
  ],
});

export const Order = mongoose.model('Order', orderSchema);
