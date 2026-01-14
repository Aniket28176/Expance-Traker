const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
require('./Models/db')
const AuthRouter = require('./Routes/AuthRouter');
const ProductRouter = require('./Routes/ProductRouter');
const ExpenceRouter = require('./Routes/ExpenceRouter');
const ensureAuthenticated = require('./Middlewares/Auth');

const PORT =process.env.PORT || 8082;

app.get('/',(req,res)=>{
    res.send("Hello Node");
})

app.use(express.json());
app.use(cors());
app.use('/auth',AuthRouter);
app.use('/products',ProductRouter);
app.use('/expences',ensureAuthenticated,ExpenceRouter)

app.listen(PORT, ()=>{
console.log(`server is running on PORT ${PORT}`);
});