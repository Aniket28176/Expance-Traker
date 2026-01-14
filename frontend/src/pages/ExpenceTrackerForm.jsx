import React, { useState } from 'react'
import { handleError } from '../utils/index';

function ExpenseTrackerForm({ addExpences }) {

    const [expenceInfo, setExpenceInfo] = useState({
        amount: '',
        text: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        const copyExpenceInfo = { ...expenceInfo };
        copyExpenceInfo[name] = value;
        setExpenceInfo(copyExpenceInfo);
    }


    const handleExpence = (e)=>{
        e.preventDefault();
        console.log(expenceInfo);
        const {text,amount} = expenceInfo;
        if(!text || !amount){
            handleError('All fields are required');
            return;
        }

      setTimeout(()=>{
        setExpenceInfo({ text:'', amount:''})
      },1000)

    addExpences({ 
         ...expenceInfo, 
        amount: Number(expenceInfo.amount) });

        
    }

    return (
        <div className='container'>
            <h1>Expense Tracker</h1>
            <form onSubmit={handleExpence}>
                <div>
                    <label htmlFor='text'>Expense Detail</label>
                    <input
                        onChange={handleChange}
                        type='text'
                        name='text'
                        placeholder='Enter your Expense Detail...'
                        value={expenceInfo.text}
                    />
                </div>
                <div>
                    <label htmlFor='amount'>Amount</label>
                    <input
                        onChange={handleChange}
                        type='number'
                        name='amount'
                        placeholder='Enter your Amount...'
                        value={expenceInfo.amount}
                    />
                </div>
                <button type='submit'>Add Expense</button>
            </form>
        </div>
    )
}

export default ExpenseTrackerForm