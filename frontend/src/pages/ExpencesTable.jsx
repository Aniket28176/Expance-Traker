import React from 'react'

const ExpencesTable = ({expences,handleDeleteExpence}) => {
    return (
    <div className='expence-list'> 
      {
        expences?.map((expence)=>(
            <div key={expence._id} className='expence-item'>
              <button className='delete-button'
              onClick={()=>handleDeleteExpence(expence._id)}
              >X</button>
              <div className='expence-description'>{expence.title || expence.text}</div>
              <div className='expence-amount'
                 style={{
                  color: expence.amount >0 ? '#27ae60' : '#e74c3c'
                 }}
              >{expence.amount}</div>
            </div>
        ))
      }
    </div>
  )
}

export default ExpencesTable