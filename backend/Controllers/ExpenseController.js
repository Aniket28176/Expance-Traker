const ExpenseModel = require('../Models/Expense');

// POST /api/expenses
const addExpense = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { title, amount, category, date, month, year } = req.body;

    if (!title || !amount || !month || !year) {
      return res.status(400).json({ message: 'Missing required fields', success: false });
    }

    const expense = await ExpenseModel.create({
      title,
      amount,
      category,
      date: date || Date.now(),
      month,
      year,
      user: userId
    });

    return res.status(201).json({ message: 'Expense created', success: true, data: expense });
  } catch (err) {
    return res.status(500).json({ message: 'Something went wrong', success: false, error: err.message });
  }
};

// GET /api/expenses?month=January&year=2026
const getExpenses = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { month, year } = req.query;

    const filter = { user: userId };
    if (month) filter.month = month;
    if (year) filter.year = parseInt(year, 10);

    const expenses = await ExpenseModel.find(filter).sort({ date: -1 });

    return res.status(200).json({ message: 'Fetched expenses', success: true, data: expenses });
  } catch (err) {
    return res.status(500).json({ message: 'Something went wrong', success: false, error: err.message });
  }
};

// DELETE /api/expenses/:id
const deleteExpense = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { id } = req.params;

    const expense = await ExpenseModel.findOneAndDelete({ _id: id, user: userId });
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found', success: false });
    }

    return res.status(200).json({ message: 'Expense deleted', success: true, data: expense });
  } catch (err) {
    return res.status(500).json({ message: 'Something went wrong', success: false, error: err.message });
  }
};

module.exports = { addExpense, getExpenses, deleteExpense };
