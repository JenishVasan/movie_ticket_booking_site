const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      index: true
    },
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      required: true
    },
    value: {
      type: Number, //if fixed discount then this will be the discount amount , if percentage then this will be the percentage
      required: true,
      min: 0
    },
    minOrderValue: {
      type: Number,
      default: 0
    },
    maxDiscountValue: {
      type: Number,
      default: null
    },
    validFrom: {
      type: Date,
      required: true,
      default: Date.now
    },
    validTo: {
      type: Date,
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    maxUsageLimit: {
      type: Number,
      default: null
    },
    usageCount: {
      type: Number,
      default: 0
    },
    applicableMovies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movie"
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coupon", couponSchema);
