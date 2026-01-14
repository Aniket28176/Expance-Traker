import React from 'react'

const ExpencesTable = ({expences,handleDeleteExpence}) => {
    console.log('Expences Table--->', expences);
    
  return (
    <div className='expence-list'> 
      {
        expences?.map((expences,index)=>(
            <div key={expences._id} className='expence-item'>
              <button className='delete-button'
              onClick={()=>handleDeleteExpence(expences._id)}
              >X</button>
              <div className='expence-description'>{expences.text}</div>
              <div className='expence-amount'
                 style={{
                  color: expences.amount >0 ? '#27ae60' : '#e74c3c'
                 }}
              >{expences.amount}</div>
            </div>
        ))
        }
        </div>
  )
}

export default ExpencesTable