import mongoose, { Document, Schema } from 'mongoose';

export interface IReceipt extends Document {
  userId: string;
  tripId?: string;
  store: string;
  storeKr: string;
  tel: string;
  address: string;
  addressKr: string;
  date: string;
  time: string;
  receiptNo: string;
  cashierNo: string;
  items: Array<{
    code: string;
    name: string;
    nameKr: string;
    price: number;
    priceKr: number;
    quantity: number;
    tax: string;
  }>;
  subtotal: number;
  subtotalKr: number;
  tax: number;
  taxKr: number;
  total: number;
  totalKr: number;
  totalAmount: number; // For budget calculations
  exchangeRate: number;
  paymentMethod: string;
  paymentMethodKr: string;
  change: number;
  changeKr: number;
  category: string;
  storeType: string;
  productTypes: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ReceiptSchema = new Schema<IReceipt>({
  userId: {
    type: String,
    required: true,
    index: true
  },
  tripId: {
    type: String,
    ref: 'Trip',
    index: true
  },
  store: {
    type: String,
    required: true
  },
  storeKr: {
    type: String,
    required: true
  },
  tel: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  addressKr: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  receiptNo: {
    type: String,
    required: true
  },
  cashierNo: {
    type: String,
    required: true
  },
  items: [{
    code: String,
    name: String,
    nameKr: String,
    price: Number,
    priceKr: Number,
    quantity: Number,
    tax: String
  }],
  subtotal: {
    type: Number,
    required: true
  },
  subtotalKr: {
    type: Number,
    required: true
  },
  tax: {
    type: Number,
    required: true
  },
  taxKr: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  totalKr: {
    type: Number,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true,
    default: function(this: IReceipt) {
      return this.totalKr || 0;
    }
  },
  exchangeRate: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    required: true
  },
  paymentMethodKr: {
    type: String,
    required: true
  },
  change: {
    type: Number,
    required: true
  },
  changeKr: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    default: '기타'
  },
  storeType: {
    type: String,
    default: '기타'
  },
  productTypes: [{
    type: String,
    default: []
  }]
}, {
  timestamps: true
});

export default mongoose.model<IReceipt>('Receipt', ReceiptSchema);
