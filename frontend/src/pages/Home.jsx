import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils/index';
import ExpencesTable from './ExpencesTable';
import ExpenseTrackerForm from './ExpenceTrackerForm';
import ExpenceDetails from './ExpenceDetails';

const APIurl = import.meta.env.VITE_API_URL || "http://localhost:8081";

function Home() {
  const[loggedInUser,setLoggedInUser] = useState('');
  const [expences,setExpences] = useState([]);
  const [ExpenceAmt,setExpenceAmt] = useState(0);
  const [IncomeAmt,setIncomeAmt] = useState(0);
  const navigate = useNavigate();

  
    useEffect(() => {
        const amounts = expences.map(item => item.amount);
        const income = amounts.filter(item => item > 0)
            .reduce((acc, item) => (acc += item), 0);
        const exp = amounts.filter(item => item < 0)
            .reduce((acc, item) => (acc += item), 0) * -1;
        setIncomeAmt(income);
        setExpenceAmt(exp);
    }, [expences])

    const handleLogout =(e)=>{
      localStorage.removeItem('token');
      localStorage.removeItem('loggedInUser');
      handleSuccess('User Loggedout');
      setTimeout(()=>{
        navigate('/login');
      },1000)
    }

    const fetchExpences = async ()=>{
      try {
        const url = `${APIurl}/expences`;
        const headers = {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
        const response = await fetch(url,headers);
        if (response.status ===403){
          navigate('/login');
          return;
        }
        const result = await response.json();
        console.log(result.data);
        setExpences(result.data);
      } catch (error) {
        handleError(error.message);
      }
    }


    useEffect(()=>{
      setLoggedInUser(localStorage.getItem('loggedInUser'));
       fetchExpences();
    },[])


   const addExpences = async (data)=>{
      try {
        const url = `${APIurl}/expences`;
        const headers = {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type':'application/json'
          },
          method: 'POST',
          body: JSON.stringify(data)
        }
        const response = await fetch(url,headers);
        if (response.status ===403){
          navigate('/login');
          return;
        }
        const result = await response.json();
        console.log(result.data);
        setExpences(result.data);
        handleSuccess(result.message);
      } catch (error) {
        handleError(error.message);
      }
    }


     const handleDeleteExpence = async (expenceId) => {
  try {
    const url = `${APIurl}/expences/${expenceId}`;
    const headers = {
      method: "DELETE",
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    };

    const response = await fetch(url, headers);

    if (response.status === 403) {
      localStorage.removeItem('token');
      navigate('/login');
      return;
    }

    const result = await response.json();
    handleSuccess(result?.message);
    setExpences(result.data);

  } catch (err) {
    handleError(err.message);
  }
};


  return (
    <div>
      <div className='user-section'>
      <h1>Welcome,{ loggedInUser }</h1>
      <button  onClick={handleLogout}>Logout</button>
      </div>
      <ExpenceDetails IncomeAmt={IncomeAmt} ExpenceAmt={ExpenceAmt}/>
      <ExpenseTrackerForm addExpences={addExpences}/>
      <ExpencesTable expences = {expences} handleDeleteExpence={handleDeleteExpence}/>
      <ToastContainer/>
    </div>
  )
}

export default Home
