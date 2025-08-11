import mongoose, { Document, Schema } from 'mongoose';

export interface ITrip extends Document {
  title: string;
  date: string;
  totalAmount: number;
  days: number;
  receiptCount: number;
  expenses: {
    totalSpent: number;
    dailyAverage: number;
    days: number;
    receipts: number;
  };
  categories: Array<{
    name: string;
    amount: number;
    percentage: number;
    color: string;
  }>;
  budget: {
    daily: number;
    total: number;
    spent: number;
    remaining: number;
    daysLeft: number;
  };
  receipts: Array<{
    id: number;
    store: string;
    date: string;
    time: string;
    amount: number;
    category: string;
    items: number;
  }>;
  members: Array<{
    id: number;
    name: string;
    avatar: string;
    spent: number;
    paid: number;
    balance: number;
  }>;
  sharedExpenses: Array<{
    id: number;
    description: string;
    amount: number;
    paidBy: string;
    participants: string[];
    date: string;
  }>;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TripSchema = new Schema<ITrip>({
  title: { type: String, required: true },
  date: { type: String, required: true },
  totalAmount: { type: Number, default: 0 },
  days: { type: Number, required: true },
  receiptCount: { type: Number, default: 0 },
  expenses: {
    totalSpent: { type: Number, default: 0 },
    dailyAverage: { type: Number, default: 0 },
    days: { type: Number, default: 0 },
    receipts: { type: Number, default: 0 }
  },
  categories: [{
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    percentage: { type: Number, required: true },
    color: { type: String, required: true }
  }],
  budget: {
    daily: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    spent: { type: Number, default: 0 },
    remaining: { type: Number, default: 0 },
    daysLeft: { type: Number, default: 0 }
  },
  receipts: [{
    id: { type: Number, required: true },
    store: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    items: { type: Number, required: true }
  }],
  members: [{
    id: { type: Number, required: true },
    name: { type: String, required: true },
    avatar: { type: String, required: true },
    spent: { type: Number, default: 0 },
    paid: { type: Number, default: 0 },
    balance: { type: Number, default: 0 }
  }],
  sharedExpenses: [{
    id: { type: Number, required: true },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    paidBy: { type: String, required: true },
    participants: [{ type: String }],
    date: { type: String, required: true }
  }],
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true
});

export default mongoose.model<ITrip>('Trip', TripSchema);
