import mongoose from 'mongoose'

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true },
  image: { type: String, required: true },
  inStock: { type: Boolean, default: true },
  isSeasonal: { type: Boolean, default: false },
  isPartOfBox: { type: Boolean, default: false },
  boxName: { type: String },
})

export default mongoose.models.Product || mongoose.model('Product', ProductSchema)

