import React from 'react'

function ExpenceDetails({IncomeAmt,ExpenceAmt}) {
  return (
  <div>
    <div>
        Your balance is {IncomeAmt-ExpenceAmt}
    </div>

     <div className="amounts-container">
                Income
                <span className="income-amount">₹{IncomeAmt}</span>
                Expense
                <span className="expense-amount">₹{ExpenceAmt}</span>
            </div>
        </div>
  )
}

export default ExpenceDetails