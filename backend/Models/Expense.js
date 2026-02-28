const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ExpenseSchema = new Schema({
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String },
  date: { type: Date, default: Date.now },
  month: { type: String, required: true },
  year: { type: Number, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'users', required: true }
});

const ExpenseModel = mongoose.model('expenses', ExpenseSchema);
module.exports = ExpenseModel;
