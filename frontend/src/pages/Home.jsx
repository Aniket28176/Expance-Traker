import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils/index';
import ExpencesTable from './ExpencesTable';
import ExpenseTrackerForm from './ExpenceTrackerForm';
import ExpenceDetails from './ExpenceDetails';

// Normalize API URL: prefer VITE_API_URL, fall back to default
const APIurlRaw = import.meta.env.VITE_API_URL || "http://localhost:8081";
let APIurl = APIurlRaw;
try {
  // If someone set just a port like ":8082", convert to full URL
  if (/^:\d+$/.test(APIurlRaw)) {
    APIurl = `http://localhost${APIurlRaw}`;
  } else if (!/^https?:\/\//i.test(APIurlRaw)) {
    // If missing protocol but includes host like "localhost:8082", add http://
    APIurl = `http://${APIurlRaw}`;
  }
} catch (e) {
  APIurl = "http://localhost:8082";
}
console.log('Using APIurl:', APIurl);

function Home() {
  const[loggedInUser,setLoggedInUser] = useState('');
  const [expences,setExpences] = useState([]);
  const [ExpenceAmt,setExpenceAmt] = useState(0);
  const [IncomeAmt,setIncomeAmt] = useState(0);
  const [month, setMonth] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const years = Array.from({length:7},(_,i)=> new Date().getFullYear() + i); // current year .. +6
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

    const fetchExpences = async (m = month, y = year) =>{
      try {
        const token = localStorage.getItem('token');
        const params = {};
        if (m) params.month = m;
        if (y) params.year = y;
        const response = await axios.get(`${APIurl}/api/expenses`, {
          headers: { Authorization: `Bearer ${token}` },
          params
        });
        const result = response.data;
        setExpences(result.data);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          navigate('/login');
          return;
        }
        handleError(error.message);
      }
    }


    useEffect(()=>{
      setLoggedInUser(localStorage.getItem('loggedInUser'));
      const now = new Date();
      const defaultMonth = months[now.getMonth()];
      setMonth(defaultMonth);
      setYear(now.getFullYear());
    },[])

    useEffect(()=>{
      if (month && year) fetchExpences(month, year);
    },[month, year])


   const addExpences = async (data)=>{
      try {
        const token = localStorage.getItem('token');
        // map frontend `text` field to API `title` and attach month/year
        const payload = {
          title: data.text || data.title,
          amount: Number(data.amount),
          category: data.category || data.category || '',
          date: data.date || new Date(),
          month: month,
          year: year
        };

        const response = await axios.post(`${APIurl}/api/expenses`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });

        handleSuccess(response.data.message);
        // re-fetch to update UI
        fetchExpences();
      } catch (error) {
        if (error.response && error.response.status === 403) {
          navigate('/login');
          return;
        }
        handleError(error.message);
      }
    }


     const handleDeleteExpence = async (expenceId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${APIurl}/api/expenses/${expenceId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    handleSuccess(response.data.message);
    fetchExpences();
  } catch (err) {
    if (err.response && err.response.status === 403) {
      localStorage.removeItem('token');
      navigate('/login');
      return;
    }
    handleError(err.message);
  }
};

  const handleMonthChange = (e) => setMonth(e.target.value);
  const handleYearChange = (e) => setYear(Number(e.target.value));

  const calculateTotal = () => {
    const amounts = expences.map(item => item.amount || 0);
    const income = amounts.filter(a => a > 0).reduce((s, v) => s + v, 0);
    const expense = amounts.filter(a => a < 0).reduce((s, v) => s + v, 0) * -1;
    return { income, expense };
  }


  return (
    <div>
      <div className='user-section'>
      <h1>Welcome,{ loggedInUser }</h1>
      <button  onClick={handleLogout}>Logout</button>
      </div>
      <div style={{display:'flex', gap: '8px', alignItems:'center', marginBottom: '12px'}}>
        <label>Month:</label>
        <select value={month} onChange={handleMonthChange}>
          <option value=''>--Select Month--</option>
          {months.map(m=> <option key={m} value={m}>{m}</option>)}
        </select>
        <label>Year:</label>
        <select value={year} onChange={handleYearChange}>
          {years.map(y=> <option key={y} value={y}>{y}</option>)}
        </select>
      </div>
      <ExpenceDetails IncomeAmt={IncomeAmt} ExpenceAmt={ExpenceAmt}/>
      <ExpenseTrackerForm addExpences={addExpences}/>
      <ExpencesTable expences = {expences} handleDeleteExpence={handleDeleteExpence}/>
      <ToastContainer/>
    </div>
  )
}

export default Home
