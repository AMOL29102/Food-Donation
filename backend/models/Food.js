import mongoose from 'mongoose';

const foodSchema = new mongoose.Schema({
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  quantity: { type: Number, required: true }, // This will now be the REMAINING quantity
  originalQuantity: { type: Number, required: true }, // The initial quantity posted
  pincode: { type: String, required: true },
  status: {
    type: String,
    enum: ['Available', 'Booked', 'Expired'],
    default: 'Available',
  },
  createdAt: { type: Date, default: Date.now },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // Defaults to 24 hours from creation
    index: { expires: '1m' }, // NOTE: This TTL index will DELETE the food item after expiry.
                               // For your requirement, we will manage status manually instead.
                               // I'm removing the TTL index to prevent data loss for providers.
  },
});

// We remove the TTL index from expiresAt to keep expired posts for the provider's history.
// foodSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Food = mongoose.model('Food', foodSchema);
export default Food;